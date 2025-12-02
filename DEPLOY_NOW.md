# Deploy to Railway + Vercel - Quick Guide

Your Supabase database is set up and ready! Follow these steps to deploy.

## Supabase Connection String (URL Encoded)

Use these in Railway environment variables:

```
DATABASE_URL=postgresql://postgres:%23HRy_Q4b%2F3WHYK.@db.hdagywjyntbfaqjsdeww.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:%23HRy_Q4b%2F3WHYK.@db.hdagywjyntbfaqjsdeww.supabase.co:5432/postgres
```

**Note:** The password is URL-encoded (`#` → `%23`, `/` → `%2F`)

## Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `shiny-carnival` repository
4. Railway will auto-detect Node.js
5. Configure the service:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start` (already configured in railway.json)
6. Go to **Variables** tab and add these environment variables:

```
DATABASE_URL=postgresql://postgres:%23HRy_Q4b%2F3WHYK.@db.hdagywjyntbfaqjsdeww.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:%23HRy_Q4b%2F3WHYK.@db.hdagywjyntbfaqjsdeww.supabase.co:5432/postgres
PORT=3001
NODE_ENV=production
TZ=Asia/Kuala_Lumpur
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
DISCORD_WEBHOOK_SECRET=your_webhook_secret_here
```

7. Railway will automatically deploy
8. Wait for deployment to complete
9. **Copy the Railway backend URL** (e.g., `https://your-app.railway.app`)

## Step 2: Run Database Migrations on Railway

After Railway deployment completes:

1. In Railway dashboard → your service → **"Deployments"** → latest deployment
2. Click **"View Logs"** or use Railway's built-in terminal
3. Run:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

   Or use Railway CLI:
   ```bash
   railway run --service your-service-name "cd backend && npx prisma migrate deploy"
   ```

**Note:** Migrations should already be applied (we did this locally), but this ensures Railway's Prisma client is generated.

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your `shiny-carnival` repository
4. Configure build settings (already in vercel.json):
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Go to **Environment Variables** and add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual Railway backend URL from Step 1)
6. Click **"Deploy"**
7. Vercel will provide a URL like `https://your-app.vercel.app`

## Step 4: Verify Deployment

1. **Test Backend API:**
   - Visit: `https://your-backend.railway.app/api/leaderboard`
   - Should return: `[]` (empty array)

2. **Test Frontend:**
   - Visit your Vercel URL
   - Register a test user
   - Check Supabase dashboard → **Table Editor** → `User` table to see the new user

3. **Test Full Flow:**
   - Click "I'm at the office" to start a parking session
   - Check `ParkingSession` table in Supabase
   - Click "I've reparked my car" to test repark functionality

## Troubleshooting

### Backend not starting on Railway
- Check Railway logs for errors
- Verify all environment variables are set correctly
- Ensure `DATABASE_URL` uses URL-encoded password

### Frontend can't connect to backend
- Verify `VITE_API_URL` in Vercel matches your Railway URL
- Check Railway backend is running (visit the URL directly)
- Check browser console for CORS errors

### Database connection fails
- Verify connection string in Railway environment variables
- Check Supabase project is active (not paused)
- Ensure password is URL-encoded correctly

## Next Steps

- Set up Discord bot token and channel ID for reminders
- Configure webhook secret for Discord integration
- Test reminder functionality
- Set up custom domain (optional)
