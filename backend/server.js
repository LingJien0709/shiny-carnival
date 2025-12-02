import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Client, GatewayIntentBits } from 'discord.js';
import cron from 'node-cron';
import crypto from 'crypto';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Discord Bot Setup
let discordClient = null;
if (process.env.DISCORD_BOT_TOKEN) {
  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers
    ]
  });

  discordClient.once('ready', () => {
    console.log('Discord bot is ready!');
  });

  discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    console.error('Failed to login Discord bot:', err);
  });
}

// Helper: Verify Discord webhook signature
function verifyDiscordWebhook(req, res, next) {
  const signature = req.headers['x-discord-signature'];
  const timestamp = req.headers['x-discord-timestamp'];
  
  if (!signature || !timestamp) {
    return res.status(401).json({ error: 'Missing Discord signature headers' });
  }

  const body = JSON.stringify(req.body);
  const secret = process.env.DISCORD_WEBHOOK_SECRET;
  
  if (!secret) {
    console.warn('DISCORD_WEBHOOK_SECRET not set, skipping signature verification');
    return next();
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(timestamp + body);
  const calculatedSignature = hmac.digest('hex');

  if (signature !== calculatedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}

// Helper: Get current date in Asia/Kuala_Lumpur timezone (YYYY-MM-DD)
function getCurrentDate() {
  const now = new Date();
  const klTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  return klTime.toISOString().split('T')[0];
}

// Helper: Get current time in Asia/Kuala_Lumpur timezone
function getCurrentTime() {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
}

// Helper: Check if current time is after 5 PM (17:00) in KL timezone
function isAfter5PM(date = null) {
  const checkDate = date || getCurrentTime();
  const klTime = new Date(checkDate.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  return klTime.getHours() >= 17;
}

// Helper: Check if date is a weekend (Saturday = 6, Sunday = 0)
function isWeekend(date = null) {
  const checkDate = date || getCurrentTime();
  const klTime = new Date(checkDate.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  const day = klTime.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

// Helper: Check if date is a public holiday (you can expand this)
function isPublicHoliday(date = null) {
  const checkDate = date || getCurrentDate();
  // Add your public holidays here (Malaysia public holidays)
  const holidays = [
    '2024-01-01', // New Year
    '2024-02-10', // Chinese New Year (example)
    '2024-02-11', // Chinese New Year Day 2
    '2024-05-01', // Labour Day
    '2024-06-17', // Hari Raya Aidiladha (example)
    '2024-08-31', // National Day
    '2024-12-25', // Christmas
    // Add more holidays as needed
  ];
  return holidays.includes(checkDate);
}

// Helper: Check if parking rules apply (not weekend, not holiday, not after 5 PM)
function shouldApplyParkingRules(date = null) {
  const checkDate = date || getCurrentTime();
  return !isWeekend(checkDate) && !isPublicHoliday(getCurrentDate()) && !isAfter5PM(checkDate);
}

// Helper: Calculate reminder time (3 hours - 20 minutes = 2 hours 40 minutes from repark time)
function calculateReminderTime(reparkTime) {
  const deadline = new Date(reparkTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours
  const reminderTime = new Date(deadline.getTime() - 20 * 60 * 1000); // 20 minutes before
  return { deadline, reminderTime };
}

// Helper: Check if reminder should be scheduled
function shouldScheduleReminder(reparkTime) {
  const now = getCurrentTime();
  
  // Don't schedule if already after 5 PM
  if (isAfter5PM(now)) {
    return false;
  }
  
  // Don't schedule on weekends or holidays
  if (!shouldApplyParkingRules(now)) {
    return false;
  }
  
  const { deadline } = calculateReminderTime(reparkTime);
  const klDeadline = new Date(deadline.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  
  // Don't schedule if deadline is after 5 PM
  if (klDeadline.getHours() >= 17) {
    return false;
  }
  
  // Don't schedule if deadline crosses to next day (outlier handling)
  const reparkDate = getCurrentDate();
  const deadlineDate = klDeadline.toISOString().split('T')[0];
  if (deadlineDate !== reparkDate) {
    return false; // Crosses midnight, don't schedule
  }
  
  return true;
}

// Helper: Send Discord reminder
async function sendParkingReminder(discordHandle, displayName, discordUserId = null) {
  if (!discordClient || !process.env.DISCORD_CHANNEL_ID) {
    console.log(`[MOCK] Would send Discord reminder to ${discordHandle}: Parking reminder for ${displayName}`);
    return;
  }

  try {
    const channel = await discordClient.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    let message = `⏰ **Parking Reminder for ${displayName}**\n\n`;
    
    if (discordUserId) {
      message += `<@${discordUserId}> `;
    } else if (discordHandle) {
      message += `@${discordHandle} `;
    }
    
    message += `\nYour 3 hour free parking is almost up (20 minutes remaining). Please repark your car to avoid charges (RM 3 per hour).`;
    
    await channel.send(message);
    console.log(`Sent Discord reminder to ${discordHandle || discordUserId}`);
  } catch (error) {
    console.error('Error sending Discord reminder:', error);
  }
}

// Discord Webhook: User Registration
app.post('/api/webhook/discord/user', verifyDiscordWebhook, async (req, res) => {
  try {
    const { userId, username, discriminator, displayName, globalName } = req.body;
    
    if (!userId || !username) {
      return res.status(400).json({ error: 'Discord userId and username are required' });
    }

    // Handle both old format (username#discriminator) and new format (username)
    const discordHandle = discriminator ? `${username}#${discriminator}` : username;
    const userDisplayName = displayName || globalName || username;

    // Check if user exists by Discord ID
    let user = await prisma.user.findFirst({
      where: { discordUserId: userId }
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          discordHandle,
          displayName: userDisplayName
        }
      });
      console.log(`User updated via Discord webhook: ${userDisplayName} (${userId})`);
    } else {
      // Check if user exists by display name
      const existingByName = await prisma.user.findFirst({
        where: { displayName: userDisplayName }
      });

      if (existingByName) {
        // Update existing user with Discord ID
        user = await prisma.user.update({
          where: { id: existingByName.id },
          data: {
            discordUserId: userId,
            discordHandle
          }
        });
        console.log(`User linked to Discord via webhook: ${userDisplayName} (${userId})`);
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            discordUserId: userId,
            discordHandle,
            displayName: userDisplayName,
            totalRmSaved: 0
          }
        });
        console.log(`New user registered via Discord webhook: ${userDisplayName} (${userId})`);
      }
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error handling Discord webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Routes

// Create or update user (frontend registration)
app.post('/api/user', async (req, res) => {
  try {
    const { displayName, discordHandle, discordUserId } = req.body;
    
    if (!displayName || !discordHandle) {
      return res.status(400).json({ error: 'Display name and Discord handle are required' });
    }

    let user = await prisma.user.findFirst({
      where: { displayName }
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { 
          discordHandle,
          discordUserId: discordUserId || user.discordUserId
        }
      });
    } else {
      user = await prisma.user.create({
        data: { 
          displayName, 
          discordHandle,
          discordUserId: discordUserId || null
        }
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user and today's active session
app.get('/api/me', async (req, res) => {
  try {
    const { displayName } = req.query;
    
    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    const today = getCurrentDate();
    const user = await prisma.user.findFirst({
      where: { displayName },
      include: {
        sessions: {
          where: {
            date: today,
            isActive: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user,
      activeSession: user.sessions[0] || null
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { totalRmSaved: 'desc' },
      select: {
        id: true,
        displayName: true,
        totalRmSaved: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start parking session ("I'm at the office")
app.post('/api/parking/start', async (req, res) => {
  try {
    const { displayName } = req.body;
    
    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    // Check if parking rules apply today
    if (!shouldApplyParkingRules()) {
      return res.status(400).json({ 
        error: 'Parking is free today (weekend/holiday/after 5 PM)' 
      });
    }

    const user = await prisma.user.findFirst({
      where: { displayName }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = getCurrentDate();
    const now = getCurrentTime();

    // Check if there's already an active session today
    let session = await prisma.parkingSession.findFirst({
      where: {
        userId: user.id,
        date: today,
        isActive: true
      }
    });

    if (session) {
      return res.json({ session, message: 'Active session already exists' });
    }

    // Create new session
    let reminderScheduledFor = null;
    if (shouldScheduleReminder(now)) {
      const { reminderTime } = calculateReminderTime(now);
      reminderScheduledFor = reminderTime;
    }

    session = await prisma.parkingSession.create({
      data: {
        userId: user.id,
        date: today,
        startTime: now,
        lastReparkTime: now,
        reminderScheduledFor,
        isActive: true,
        timesReparked: 0
      }
    });

    res.json({ session });
  } catch (error) {
    console.error('Error starting parking session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Repark car ("I've reparked my car")
app.post('/api/parking/repark', async (req, res) => {
  try {
    const { displayName } = req.body;
    
    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    const now = getCurrentTime();
    
    // Check if parking rules still apply
    if (!shouldApplyParkingRules(now)) {
      return res.status(400).json({ 
        error: 'Parking is free now (weekend/holiday/after 5 PM), no need to repark' 
      });
    }

    const user = await prisma.user.findFirst({
      where: { displayName }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = getCurrentDate();
    const session = await prisma.parkingSession.findFirst({
      where: {
        userId: user.id,
        date: today,
        isActive: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'No active parking session found' });
    }

    // Check if 3 hours have passed (shouldn't repark if already past deadline)
    const deadline = new Date(session.lastReparkTime.getTime() + 3 * 60 * 60 * 1000);
    if (now >= deadline) {
      return res.status(400).json({ 
        error: '3 hour window has passed. Please start a new session.' 
      });
    }

    // Update session
    let reminderScheduledFor = null;
    if (shouldScheduleReminder(now)) {
      const { reminderTime } = calculateReminderTime(now);
      reminderScheduledFor = reminderTime;
    }

    // Increment RM saved (each repark saves RM 3)
    const rmSaved = 3;

    await prisma.parkingSession.update({
      where: { id: session.id },
      data: {
        lastReparkTime: now,
        timesReparked: session.timesReparked + 1,
        reminderScheduledFor,
        reminderSentAt: null // Reset reminder sent status
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalRmSaved: user.totalRmSaved + rmSaved
      }
    });

    const updatedSession = await prisma.parkingSession.findUnique({
      where: { id: session.id }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    res.json({ session: updatedSession, user: updatedUser, rmSaved });
  } catch (error) {
    console.error('Error reparking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test Discord integration
app.post('/api/discord/test', async (req, res) => {
  try {
    const { discordHandle, displayName, discordUserId } = req.body;
    
    if (!discordHandle || !displayName) {
      return res.status(400).json({ error: 'Discord handle and display name are required' });
    }

    await sendParkingReminder(discordHandle, displayName, discordUserId);
    res.json({ message: 'Test message sent (or would be sent in production)' });
  } catch (error) {
    console.error('Error testing Discord:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Improved Cron Job: Check for reminders every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = getCurrentTime();
    const today = getCurrentDate();
    
    // Skip if parking rules don't apply (weekend/holiday/after 5 PM)
    if (!shouldApplyParkingRules(now)) {
      return; // Don't send reminders on weekends/holidays/after 5 PM
    }
    
    // Find sessions that need reminders
    const sessionsToRemind = await prisma.parkingSession.findMany({
      where: {
        isActive: true,
        date: today, // Only today's sessions
        reminderScheduledFor: {
          lte: now // Reminder time has arrived
        },
        reminderSentAt: null // Haven't sent reminder yet
      },
      include: {
        user: true
      }
    });

    for (const session of sessionsToRemind) {
      try {
        // Double-check conditions before sending
        const sessionTime = new Date(session.lastReparkTime);
        const deadline = new Date(sessionTime.getTime() + 3 * 60 * 60 * 1000);
        const timeRemaining = deadline - now;
        
        // Only send if:
        // 1. Still before 5 PM
        // 2. Still within the 3 hour window
        // 3. At least 20 minutes before deadline (reminder window)
        if (!isAfter5PM(now) && timeRemaining > 0 && timeRemaining <= 20 * 60 * 1000) {
          await sendParkingReminder(
            session.user.discordHandle, 
            session.user.displayName,
            session.user.discordUserId
          );
          
          await prisma.parkingSession.update({
            where: { id: session.id },
            data: {
              reminderSentAt: now
            }
          });
          
          console.log(`Reminder sent for ${session.user.displayName} at ${now.toISOString()}`);
        }
      } catch (error) {
        console.error(`Error processing reminder for session ${session.id}:`, error);
      }
    }
    
    // Clean up old inactive sessions (older than 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    await prisma.parkingSession.updateMany({
      where: {
        isActive: false,
        updatedAt: {
          lt: weekAgo
        }
      },
      data: {
        isActive: false
      }
    });
    
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Discord webhook endpoint: http://localhost:${PORT}/api/webhook/discord/user`);
});
