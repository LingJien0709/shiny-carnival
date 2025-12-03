# Installing Node.js

To run this app locally, you need Node.js 18+ installed.

## Quick Install Options:

### Option 1: Download Installer (Easiest)
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Restart your terminal

### Option 2: Using Homebrew (if you have it)
```bash
brew install node
```

### Option 3: Using nvm (Node Version Manager)
```bash
# Install nvm first
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install --lts
nvm use --lts
```

## Verify Installation
After installing, verify it works:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

## Then Run Setup
Once Node.js is installed, run:
```bash
./setup.sh
```

Or manually:
```bash
npm run install:all
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
cd ..
npm run dev
```




