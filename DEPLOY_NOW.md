# 🚀 Deploy Now - Step by Step

Follow these exact steps to get your app live.

## Prerequisites
- GitHub account
- Supabase account (free)
- Discord bot token

## Step 1: Push to GitHub (2 min)

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial commit - Parking Reminder app"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/parking-reminder.git
git push -u origin main
```

## Step 2: Set Up Supabase Database (3 min)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Create project, save password
3. Go to Settings → Database → Connection string (URI)
4. Copy connection string
5. Replace `[YOUR-PASSWORD]` with your password

## Step 3: Deploy Backend to Railway (5 min)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click on the service → Settings
5. Set **Root Directory**: `backend`
6. Go to **Variables** tab, add:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_discord_channel_id
DISCORD_WEBHOOK_SECRET=generate_with_openssl_rand_hex_32
PORT=3001
NODE_ENV=production
TZ=Asia/Kuala_Lumpur
```

7. Railway will auto-deploy
8. Wait for deployment, copy the URL (e.g., `https://your-app.railway.app`)

9. **Run migrations**: In Railway dashboard → Deployments → View Logs → Run:
```bash
cd backend && npx prisma migrate deploy
```

## Step 4: Deploy Frontend to Vercel (3 min)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Railway backend URL (from Step 3)
6. Click "Deploy"
7. Wait for deployment → Copy URL (e.g., `https://your-app.vercel.app`)

## Step 5: Update vercel.json (1 min)

Edit `vercel.json` and replace:
```json
"destination": "https://your-backend-url.railway.app/api/$1"
```
With your actual Railway URL.

Then push to GitHub:
```bash
git add vercel.json
git commit -m "Update backend URL"
git push
```

Vercel will auto-redeploy.

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Register a user
3. Click "I'm at the office"
4. Verify it works!

## Your URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API Endpoint**: `https://your-app.railway.app/api`

## Troubleshooting

**Backend not working?**
- Check Railway logs
- Verify environment variables
- Ensure migrations ran

**Frontend can't connect?**
- Check `VITE_API_URL` in Vercel
- Verify backend URL is correct
- Check browser console for errors

**Database errors?**
- Verify Supabase connection string
- Check if migrations ran
- Verify database is active

## Next Steps

1. Set up custom domain (optional)
2. Configure Discord webhook
3. Add monitoring
4. Set up backups

## Quick Commands Reference

```bash
# Generate webhook secret
openssl rand -hex 32

# Test backend locally
cd backend && npm start

# Test frontend locally  
cd frontend && npm run dev

# Run migrations
cd backend && npx prisma migrate deploy
```

---

**That's it!** Your app should now be live. Share the Vercel URL with your team! 🎉

