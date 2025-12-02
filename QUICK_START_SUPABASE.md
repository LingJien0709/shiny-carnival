# Quick Start: Supabase + Discord Webhook

Get your app running with Supabase and Discord webhooks in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Discord account
- Supabase account (free tier works)

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Fill in:
   - Name: `parking-reminder`
   - Password: (save this!)
   - Region: Southeast Asia (or closest)
4. Wait for project creation

## Step 2: Get Connection String (1 min)

1. In Supabase dashboard: **Settings** → **Database**
2. Copy **Connection string** (URI tab)
3. Replace `[YOUR-PASSWORD]` with your actual password

## Step 3: Configure Environment (1 min)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
DISCORD_BOT_TOKEN=your_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
DISCORD_WEBHOOK_SECRET=$(openssl rand -hex 32)
```

Generate webhook secret:
```bash
openssl rand -hex 32
```

## Step 4: Run Migrations (1 min)

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed  # Optional: creates sample data
```

## Step 5: Start Server

```bash
cd ..
npm run dev
```

## Step 6: Set Up Discord Webhook

See `DISCORD_WEBHOOK_SETUP.md` for detailed instructions.

Quick version:
1. Create Discord bot at [discord.com/developers](https://discord.com/developers)
2. Get bot token → add to `.env`
3. Invite bot to server
4. Configure webhook to send to `/api/webhook/discord/user`

## Verify It Works

1. Open http://localhost:3000
2. Register a user
3. Check Supabase dashboard → Table Editor → see user created
4. Click "I'm at the office"
5. Wait for reminder (or test manually)

## Troubleshooting

**Can't connect to Supabase?**
- Check password in connection string
- Verify project is active (not paused)

**Migration fails?**
- Ensure Prisma client is generated: `npm run db:generate`
- Check connection string format

**Discord webhook not working?**
- Verify webhook secret matches
- Check server logs for errors
- Test endpoint manually with curl

## Next Steps

- Read `SUPABASE_SETUP.md` for detailed Supabase setup
- Read `DISCORD_WEBHOOK_SETUP.md` for Discord integration
- Read `MIGRATION_GUIDE.md` if migrating from SQLite

