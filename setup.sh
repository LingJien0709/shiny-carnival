#!/bin/bash

# Setup script for OC Payment Reminder
# Make sure Node.js 18+ is installed before running this

set -e

echo "🚀 Setting up OC Payment Reminder..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    echo "Or use Homebrew: brew install node"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install:all

# Set up backend environment
echo ""
echo "⚙️  Setting up backend environment..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your Discord bot token and channel ID"
    echo "   - DISCORD_BOT_TOKEN=your_token_here"
    echo "   - DISCORD_CHANNEL_ID=your_channel_id_here"
    echo ""
    read -p "Press Enter after you've updated .env (or Ctrl+C to cancel)..."
else
    echo "✅ .env file already exists"
fi

# Set up database
echo ""
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:migrate
npm run db:seed

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app, run:"
echo "  npm run dev"
echo ""
echo "Or start them separately:"
echo "  Terminal 1: npm run dev:backend"
echo "  Terminal 2: npm run dev:frontend"




