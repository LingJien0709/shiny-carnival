# Deployment Guide

Deploy your Parking Reminder app to production in 3 steps.

## Quick Deploy (Recommended: Vercel + Railway)

### Step 1: Deploy Backend to Railway (5 min)

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the repository

3. **Configure Service**
   - Railway will auto-detect Node.js
   - Set **Root Directory** to: `backend`
   - Set **Start Command** to: `npm start`

4. **Add Environment Variables**
   Click "Variables" and add:
   ```
   DATABASE_URL=your_supabase_connection_string
   DIRECT_URL=your_supabase_connection_string
   DISCORD_BOT_TOKEN=your_discord_bot_token
   DISCORD_CHANNEL_ID=your_discord_channel_id
   DISCORD_WEBHOOK_SECRET=your_webhook_secret
   PORT=3001
   NODE_ENV=production
   TZ=Asia/Kuala_Lumpur
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

6. **Run Migrations**
   - Go to Railway dashboard → your service
   - Click "Deployments" → Latest deployment
   - Click "View Logs"
   - In the terminal, run:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma db seed  # Optional
   ```

### Step 2: Deploy Frontend to Vercel (3 min)

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your Railway backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Vercel will give you a URL like `https://your-app.vercel.app`

### Step 3: Update Frontend API URL

After getting your Railway backend URL:

1. Go back to Vercel project settings
2. Update `VITE_API_URL` environment variable
3. Redeploy (or it will auto-redeploy)

## Alternative: Deploy Everything to Railway

You can also deploy both frontend and backend to Railway:

### Backend Service
- Root: `backend`
- Start: `npm start`

### Frontend Service  
- Root: `frontend`
- Build: `npm run build`
- Start: `npm run preview` (or use static file serving)

## Alternative: Deploy to Render

### Backend on Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Name**: `parking-reminder-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run db:generate`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (same as Railway)
6. Deploy

### Frontend on Render

1. New → Static Site
2. Connect GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

## Update Frontend to Use Production API

Update `frontend/src/App.jsx`:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

This will use the environment variable in production.

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Discord bot token set
- [ ] Webhook endpoint accessible
- [ ] Test user registration
- [ ] Test parking session creation
- [ ] Test reminder functionality

## Custom Domain (Optional)

### Vercel
1. Go to project settings → Domains
2. Add your domain
3. Follow DNS instructions

### Railway
1. Go to service settings → Networking
2. Add custom domain
3. Configure DNS

## Monitoring

### Railway
- View logs in dashboard
- Set up alerts for errors

### Vercel
- View analytics in dashboard
- Set up error tracking

## Troubleshooting

### Backend not starting
- Check environment variables
- Verify database connection
- Check logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Verify backend is running

### Database connection fails
- Verify Supabase connection string
- Check if database is active
- Verify password is correct

## Cost Estimate

**Free Tier:**
- Railway: 500 hours/month free
- Vercel: Unlimited (with limits)
- Supabase: 500MB database free

**Total: $0/month** for small usage!

