# Discord Webhook Setup Guide

This guide explains how to set up Discord webhooks to automatically register users when they join your Discord server.

## Overview

When a user joins your Discord server, a webhook will send their information to your backend API endpoint `/api/webhook/discord/user`, which will automatically create or update the user in your Supabase database.

## Step 1: Create a Discord Bot (if not already done)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name your application (e.g., "Parking Reminder Bot")
4. Go to the "Bot" section
5. Click "Add Bot"
6. Copy the bot token and add it to your `.env` file as `DISCORD_BOT_TOKEN`
7. Enable these Privileged Gateway Intents:
   - Server Members Intent
   - Message Content Intent

## Step 2: Set Up Discord Webhook Secret

Generate a secure secret for webhook verification:

```bash
# Generate a random secret
openssl rand -hex 32
```

Copy the generated secret and add it to your `.env` file:

```env
DISCORD_WEBHOOK_SECRET=your_generated_secret_here
```

## Step 3: Configure Discord Server Webhook

### Option A: Using Discord Bot Events (Recommended)

1. In your Discord Developer Portal, go to your application
2. Navigate to "Webhooks" section
3. Create a new webhook
4. Set the webhook URL to: `https://your-domain.com/api/webhook/discord/user`
5. Select events to listen to:
   - `guild_member_add` - When a member joins the server
   - `guild_member_update` - When a member's information is updated

### Option B: Using Discord Server Webhooks

1. In your Discord server, go to **Server Settings** → **Integrations** → **Webhooks**
2. Click **New Webhook**
3. Configure:
   - **Name**: Parking Reminder Registration
   - **Channel**: Choose a channel (or create a private channel)
   - **Webhook URL**: `https://your-domain.com/api/webhook/discord/user`
4. Copy the webhook secret and add it to `.env` as `DISCORD_WEBHOOK_SECRET`

## Step 4: Set Up Discord Bot Events Handler

You'll need to handle Discord events. Here are two approaches:

### Approach 1: Use Discord Bot with Event Handler

Add this to your Discord bot code (or create a separate event handler):

```javascript
// In your Discord bot setup
discordClient.on('guildMemberAdd', async (member) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhook/discord/user';
    const secret = process.env.DISCORD_WEBHOOK_SECRET;
    
    const payload = {
      userId: member.user.id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      displayName: member.displayName || member.user.globalName || member.user.username,
      globalName: member.user.globalName
    };
    
    // Create signature
    const timestamp = Date.now().toString();
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(timestamp + JSON.stringify(payload));
    const signature = hmac.digest('hex');
    
    // Send to webhook endpoint
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Discord-Signature': signature,
        'X-Discord-Timestamp': timestamp
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`User registered via Discord: ${payload.displayName}`);
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
});
```

### Approach 2: Use Discord Webhook Service (External)

Use a service like Zapier, Make.com, or n8n to:
1. Listen for Discord events
2. Transform the data
3. Send HTTP POST to your webhook endpoint

## Step 5: Test the Webhook

### Test using curl:

```bash
# Generate timestamp and signature
TIMESTAMP=$(date +%s)
SECRET="your_webhook_secret"
PAYLOAD='{"userId":"123456789","username":"testuser","displayName":"Test User"}'

# Create signature
SIGNATURE=$(echo -n "${TIMESTAMP}${PAYLOAD}" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)

# Send request
curl -X POST http://localhost:3001/api/webhook/discord/user \
  -H "Content-Type: application/json" \
  -H "X-Discord-Signature: ${SIGNATURE}" \
  -H "X-Discord-Timestamp: ${TIMESTAMP}" \
  -d "${PAYLOAD}"
```

### Test using Postman:

1. Create a POST request to `http://localhost:3001/api/webhook/discord/user`
2. Headers:
   - `Content-Type: application/json`
   - `X-Discord-Signature: [calculated signature]`
   - `X-Discord-Timestamp: [current timestamp]`
3. Body (JSON):
```json
{
  "userId": "123456789",
  "username": "testuser",
  "discriminator": "1234",
  "displayName": "Test User",
  "globalName": "Test User"
}
```

## Step 6: Webhook Payload Format

The webhook expects this payload format:

```json
{
  "userId": "Discord User ID (string)",
  "username": "Discord username",
  "discriminator": "Discord discriminator (optional, for old format)",
  "displayName": "Display name (optional, falls back to username)",
  "globalName": "Global display name (optional)"
}
```

## Step 7: Security Considerations

1. **Always verify webhook signatures** - The endpoint verifies the signature to ensure requests are legitimate
2. **Use HTTPS in production** - Never expose webhook endpoints over HTTP
3. **Rotate secrets regularly** - Change your `DISCORD_WEBHOOK_SECRET` periodically
4. **Rate limiting** - Consider adding rate limiting to prevent abuse
5. **IP whitelisting** - Optionally whitelist Discord's IP ranges

## Troubleshooting

### Webhook not receiving events
- Check that your bot has the correct intents enabled
- Verify the webhook URL is accessible
- Check server logs for errors

### Signature verification failing
- Ensure `DISCORD_WEBHOOK_SECRET` matches between Discord and your server
- Verify timestamp is being sent correctly
- Check that payload is being stringified consistently

### Users not being created
- Check database connection (Supabase)
- Verify Prisma migrations have been run
- Check server logs for error messages

## Production Deployment

When deploying to production:

1. Update webhook URL to your production domain
2. Ensure SSL certificate is valid
3. Set up monitoring/alerting for webhook failures
4. Consider using a queue system for webhook processing
5. Add logging and analytics

## Example: Complete Discord Bot Integration

Create a file `discord-bot.js`:

```javascript
import { Client, GatewayIntentBits } from 'discord.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log('Discord bot is ready!');
});

client.on('guildMemberAdd', async (member) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhook/discord/user';
    const secret = process.env.DISCORD_WEBHOOK_SECRET;
    
    const payload = {
      userId: member.user.id,
      username: member.user.username,
      discriminator: member.user.discriminator || '0',
      displayName: member.displayName || member.user.globalName || member.user.username,
      globalName: member.user.globalName
    };
    
    const timestamp = Date.now().toString();
    const body = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(timestamp + body);
    const signature = hmac.digest('hex');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Discord-Signature': signature,
        'X-Discord-Timestamp': timestamp
      },
      body: body
    });
    
    if (response.ok) {
      console.log(`✅ User registered: ${payload.displayName}`);
    } else {
      console.error(`❌ Failed to register user: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in guildMemberAdd:', error);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

Run this alongside your main server, or integrate it into your existing server.js.

