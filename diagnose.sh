#!/bin/bash

echo "🔍 Diagnosing OC Payment Reminder Setup..."
echo ""

# Check Node.js
echo "1. Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js found: $NODE_VERSION"
    
    # Check version (need 18+)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        echo "   ✅ Node.js version is 18+ (compatible)"
    else
        echo "   ⚠️  Node.js version is below 18 (may have issues)"
    fi
else
    echo "   ❌ Node.js NOT FOUND"
    echo "   → Install from https://nodejs.org/ or run: brew install node"
fi

# Check npm
echo ""
echo "2. Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm found: $NPM_VERSION"
else
    echo "   ❌ npm NOT FOUND"
fi

# Check dependencies
echo ""
echo "3. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Root node_modules exists"
else
    echo "   ⚠️  Root node_modules missing - run: npm install"
fi

if [ -d "backend/node_modules" ]; then
    echo "   ✅ Backend node_modules exists"
else
    echo "   ⚠️  Backend node_modules missing - run: cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo "   ✅ Frontend node_modules exists"
else
    echo "   ⚠️  Frontend node_modules missing - run: cd frontend && npm install"
fi

# Check database
echo ""
echo "4. Checking database setup..."
if [ -f "backend/prisma/dev.db" ]; then
    echo "   ✅ Database file exists"
else
    echo "   ⚠️  Database file missing - run: cd backend && npm run db:migrate"
fi

if [ -f "backend/.env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "DISCORD_BOT_TOKEN=your_discord_bot_token_here" backend/.env 2>/dev/null; then
        echo "   ⚠️  Discord token not configured (app will work but reminders won't send)"
    else
        echo "   ✅ Discord token appears configured"
    fi
else
    echo "   ⚠️  .env file missing - run: cp backend/.env.example backend/.env"
fi

# Check Prisma client
echo ""
echo "5. Checking Prisma client..."
if [ -d "backend/node_modules/.prisma" ]; then
    echo "   ✅ Prisma client generated"
else
    echo "   ⚠️  Prisma client not generated - run: cd backend && npm run db:generate"
fi

# Check ports
echo ""
echo "6. Checking if ports are available..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 3000 is in use (frontend)"
else
    echo "   ✅ Port 3000 is available (frontend)"
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 3001 is in use (backend)"
else
    echo "   ✅ Port 3001 is available (backend)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Summary:"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ CRITICAL: Node.js is not installed"
    echo "   → Install Node.js first: https://nodejs.org/"
    echo "   → Or: brew install node"
    exit 1
fi

echo "✅ Basic requirements met!"
echo ""
echo "To start the app, run:"
echo "  npm run dev"
echo ""
echo "Or start separately:"
echo "  Terminal 1: npm run dev:backend"
echo "  Terminal 2: npm run dev:frontend"


