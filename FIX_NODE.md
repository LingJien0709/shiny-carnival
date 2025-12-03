# Fix: Node.js Not Found

## The Problem
The app cannot run because Node.js is not installed or not in your PATH.

## Quick Fix Options

### Option 1: Install via Homebrew (Recommended for macOS)

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version

# Restart your terminal, then run:
cd "/Users/lingjien/Desktop/OC_Payment Reminder"
./setup.sh
```

### Option 2: Download Installer

1. Visit: https://nodejs.org/
2. Download the **LTS version** (v20.x.x or v18.x.x)
3. Run the installer
4. **Restart your terminal** (important!)
5. Verify: `node --version`
6. Run: `./setup.sh`

### Option 3: Use nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install --lts
nvm use --lts

# Verify
node --version

# Run setup
cd "/Users/lingjien/Desktop/OC_Payment Reminder"
./setup.sh
```

## After Installing Node.js

Once Node.js is installed, run the diagnostic again:

```bash
./diagnose.sh
```

Then run the setup:

```bash
./setup.sh
```

Or manually:

```bash
# 1. Install dependencies
npm run install:all

# 2. Set up database
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed

# 3. Start the app
cd ..
npm run dev
```

## Verify Installation

After installing, verify Node.js is accessible:

```bash
which node
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

If `which node` returns nothing, Node.js is not in your PATH. Try restarting your terminal or check the installation.




