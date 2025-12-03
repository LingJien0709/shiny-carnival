# Quick Start Guide

## 1. Install Dependencies

```bash
npm run install:all
```

## 2. Set Up Discord Bot

1. Create a bot at https://discord.com/developers/applications
2. Copy the bot token
3. Enable "Message Content Intent"
4. Invite bot to your server
5. Create/use a channel and copy its ID

## 3. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env and add your Discord bot token and channel ID
```

## 4. Set Up Database

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 5. Run the App

From root directory:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Testing Without Discord

If you don't have Discord set up yet, the app will still work but reminders will be logged to console instead of sent to Discord.




