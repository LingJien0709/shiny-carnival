# OC Payment Reminder - Parking Reminder App

A web app that reminds colleagues to repark their cars before the 3-hour mark via Discord, helping them save on parking fees.

## Features

- 🚗 **Parking Session Tracking**: Start a 3-hour countdown when you arrive at the office
- ⏰ **Discord Reminders**: Automatic reminders sent 20 minutes before the 3-hour mark
- 💰 **Cost Savings Tracker**: Track how much you've saved by reparking on time
- 🏆 **Leaderboard**: See who's saved the most on parking fees
- 🎨 **Modern UI**: Discord/Twitch-inspired dark theme with Tailwind CSS + DaisyUI

## Parking Rules

- **Free for first 3 hours**
- **Free after 5 PM**
- **RM 3 per hour** otherwise

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS + DaisyUI
- **Backend**: Node.js + Express
- **Database**: SQLite with Prisma ORM
- **Discord Integration**: discord.js
- **Scheduling**: node-cron for reminder jobs

## Prerequisites

- Node.js 18+ and npm
- Discord Bot Token and Channel ID (see Discord Setup below)

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for the root, backend, and frontend.

### 2. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token
5. Enable "Message Content Intent" under Privileged Gateway Intents
6. Invite the bot to your server with these permissions:
   - Send Messages
   - View Channels
7. Create a channel (e.g., `#parking-reminders`) or use an existing one
8. Copy the channel ID (enable Developer Mode in Discord, right-click channel → Copy ID)

### 3. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
PORT=3001
NODE_ENV=development
TZ=Asia/Kuala_Lumpur
```

### 4. Database Setup

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

The seed script creates sample users for the leaderboard demo.

### 5. Run the Application

From the root directory:

```bash
npm run dev
```

This starts both:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## Usage

1. **First Visit**: Enter your display name and Discord handle (format: `username#1234`)
2. **Start Parking**: Click "I'm at the office" when you arrive
3. **Get Reminded**: You'll receive a Discord reminder 20 minutes before the 3-hour mark
4. **Repark**: Click "I've reparked my car" to restart the countdown and save RM 3
5. **Track Savings**: Watch your total savings grow on the leaderboard!

## API Endpoints

- `POST /api/user` - Create or update user
- `GET /api/me?displayName=...` - Get current user and active session
- `GET /api/leaderboard` - Get leaderboard
- `POST /api/parking/start` - Start parking session
- `POST /api/parking/repark` - Repark car
- `POST /api/discord/test` - Test Discord integration

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── server.js               # Express server + API routes
│   ├── seed.js                 # Seed script for demo data
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Leaderboard.jsx
│   │   │   └── UserCard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Parking Logic Details

### Reminder Scheduling

- Reminders are scheduled 20 minutes before the 3-hour deadline
- No reminders after 5 PM (parking is free)
- No reminders if the 3-hour window extends past 5 PM
- Cron job runs every minute to check for pending reminders

### RM Saved Calculation

- Each successful repark before the 3-hour deadline (and before 5 PM) saves RM 3
- This is added to the user's `totalRmSaved` field
- The leaderboard sorts users by `totalRmSaved` descending

### Timezone Handling

All parking logic uses `Asia/Kuala_Lumpur` timezone:
- Current time checks
- 5 PM cutoff
- Date calculations

## Development Notes

- The reminder cron job runs every minute in production
- In development, you can test reminders by manually triggering them or waiting for the scheduled time
- User authentication is simplified (uses displayName as identifier) - in production, implement proper auth
- Discord bot posts messages to the configured channel and mentions the user's handle

## Troubleshooting

**Discord bot not sending messages:**
- Verify bot token is correct
- Check bot has permissions in the channel
- Ensure "Message Content Intent" is enabled
- Verify channel ID is correct

**Database errors:**
- Run `npm run db:migrate` to ensure schema is up to date
- Check `DATABASE_URL` in `.env` is correct

**Port conflicts:**
- Backend defaults to 3001, frontend to 3000
- Change in `backend/.env` (PORT) or `frontend/vite.config.js` if needed

## License

MIT


