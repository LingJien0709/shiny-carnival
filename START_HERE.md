# 🚀 START HERE - Quick Setup Guide

## Step 1: Install Node.js (Required)

**If Node.js is NOT installed:**

### macOS (Easiest):
1. Open Terminal
2. Install Homebrew (if you don't have it):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Node.js:
   ```bash
   brew install node
   ```

### Or Download Directly:
- Visit: https://nodejs.org/
- Download the **LTS version** (recommended)
- Run the installer
- **Restart your terminal** after installation

### Verify Installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## Step 2: Run Setup Script

Once Node.js is installed, run:

```bash
./setup.sh
```

This will:
- ✅ Install all dependencies
- ✅ Create database
- ✅ Set up sample data
- ⚠️  Ask you to configure Discord (you can skip for now)

---

## Step 3: Configure Discord (Optional for Testing)

The app works without Discord, but reminders won't be sent.

To enable Discord reminders:
1. Edit `backend/.env`
2. Add your Discord bot token and channel ID
3. See `README.md` for detailed Discord setup instructions

---

## Step 4: Start the App

```bash
npm run dev
```

This starts both:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

Open http://localhost:3000 in your browser!

---

## Quick Test (Without Discord)

1. Open http://localhost:3000
2. Enter your name and any Discord handle (e.g., `test#1234`)
3. Click "I'm at the office"
4. Watch the countdown timer!
5. Click "I've reparked my car" to restart the timer

Reminders will be logged to the backend console (not sent to Discord if not configured).

---

## Troubleshooting

**"command not found: node"**
- Node.js is not installed - see Step 1 above

**"Cannot find module"**
- Run `npm run install:all` again

**Database errors**
- Run `cd backend && npm run db:migrate`

**Port already in use**
- Change ports in `backend/.env` (PORT) or `frontend/vite.config.js`

---

## Need Help?

Check these files:
- `README.md` - Full documentation
- `INSTALL_NODE.md` - Detailed Node.js installation guide
- `QUICKSTART.md` - Quick reference




