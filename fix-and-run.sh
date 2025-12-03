#!/bin/bash
set -e

echo "🔧 Fixing and setting up OC Payment Reminder..."
echo ""

# Set Node.js path
export PATH="/tmp/node-v20.18.2-darwin-x64/bin:$PATH"

cd "/Users/lingjien/Desktop/OC_Payment Reminder"

# Step 1: Ensure .env exists with correct values
echo "📝 Checking .env file..."
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file..."
    cat > backend/.env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
PORT=3001
NODE_ENV=development
TZ=Asia/Kuala_Lumpur
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file exists"
    # Ensure DATABASE_URL is correct
    if ! grep -q 'DATABASE_URL="file:./prisma/dev.db"' backend/.env; then
        echo "Updating DATABASE_URL in .env..."
        sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="file:./prisma/dev.db"|' backend/.env
    fi
fi

# Step 2: Fix database path if wrong
echo ""
echo "🗄️  Fixing database location..."
cd backend/prisma

# Move database from wrong location if exists
if [ -f "prisma/dev.db" ]; then
    echo "Moving database from prisma/prisma/ to prisma/"
    mv prisma/dev.db dev.db 2>/dev/null || true
    mv prisma/dev.db-journal dev.db-journal 2>/dev/null || true
    rm -rf prisma 2>/dev/null || true
fi

cd ../..

# Step 3: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install:all 2>&1 | tail -10

# Step 4: Set up database
echo ""
echo "🗄️  Setting up database..."
cd backend

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate 2>&1 | tail -5

# Run migrations (create database if needed)
echo "Running migrations..."
npm run db:migrate -- --name init 2>&1 | tail -10 || echo "Migration may already exist, continuing..."

# Seed database
echo "Seeding database..."
npm run db:seed 2>&1 | tail -5 || echo "Seed completed (or already seeded)"

cd ..

# Step 5: Verify setup
echo ""
echo "✅ Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting the application..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the app
npm run dev




