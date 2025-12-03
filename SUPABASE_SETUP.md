# Supabase Setup Guide

This guide walks you through setting up Supabase as your database for the Parking Reminder app.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **New Project**
4. Fill in:
   - **Name**: `parking-reminder` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., Southeast Asia for Malaysia)
5. Click **Create new project**
6. Wait for project to be created (takes 1-2 minutes)

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set during project creation

## Step 3: Update Environment Variables

Update your `backend/.env` file:

```env
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
DISCORD_WEBHOOK_SECRET=your_webhook_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Timezone (for parking logic)
TZ=Asia/Kuala_Lumpur
```

**Important**: Replace:
- `YOUR_PASSWORD` with your actual database password
- `xxxxx` with your project reference ID

## Step 4: Run Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Run migrations to create tables in Supabase
npm run db:migrate
```

This will:
1. Connect to your Supabase database
2. Create the `User` and `ParkingSession` tables
3. Set up indexes and foreign keys

## Step 5: Verify Tables Created

1. In Supabase dashboard, go to **Table Editor**
2. You should see:
   - `User` table
   - `ParkingSession` table

## Step 6: Seed Sample Data (Optional)

```bash
cd backend
npm run db:seed
```

This creates sample users for testing.

## Step 7: Test Connection

Start your server:

```bash
npm run dev
```

Check the console for:
- ✅ Database connection successful
- ✅ Tables accessible

## Troubleshooting

### Connection Error: "password authentication failed"
- Double-check your password in the connection string
- Ensure you're using the correct password from project creation

### Connection Error: "timeout"
- Check your network connection
- Verify the connection string is correct
- Ensure Supabase project is active (not paused)

### Migration Error: "relation already exists"
- Tables might already exist
- Use `npx prisma migrate reset` to reset (⚠️ deletes all data)
- Or use `npx prisma migrate deploy` for production

### SSL Connection Required
If you get SSL errors, add `?sslmode=require` to your connection string:
```
postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

## Production Considerations

### Connection Pooling

Supabase provides connection pooling. Use the pooled connection string for better performance:

1. Go to **Settings** → **Database** → **Connection pooling**
2. Use the **Session mode** connection string for migrations
3. Use the **Transaction mode** connection string for your app (better for serverless)

### Environment Variables in Production

- Never commit `.env` files
- Use environment variables in your hosting platform
- Supabase provides environment variable management in dashboard

### Database Backups

Supabase automatically backs up your database:
- Daily backups for free tier
- Point-in-time recovery available
- Check **Settings** → **Database** → **Backups**

## Next Steps

After setting up Supabase:
1. ✅ Set up Discord webhook (see `DISCORD_WEBHOOK_SETUP.md`)
2. ✅ Configure cron jobs for reminders
3. ✅ Test the full flow

## Useful Supabase Features

- **Table Editor**: View/edit data directly in dashboard
- **SQL Editor**: Run custom queries
- **API**: Auto-generated REST API (optional)
- **Realtime**: Real-time subscriptions (optional)
- **Storage**: File storage (for future features)

## Migration from SQLite

If you're migrating from SQLite:

1. Export data from SQLite:
```bash
sqlite3 prisma/dev.db .dump > backup.sql
```

2. Import to Supabase (adjust SQL syntax if needed):
   - Use Supabase SQL Editor
   - Or use `psql` command-line tool

3. Update connection string in `.env`

4. Run migrations:
```bash
npm run db:migrate
```



