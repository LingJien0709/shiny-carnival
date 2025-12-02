# Migration Guide: SQLite → Supabase

This guide helps you migrate from SQLite to Supabase PostgreSQL.

## Quick Start

1. **Set up Supabase** (see `SUPABASE_SETUP.md`)
2. **Update environment variables** (see `.env.example`)
3. **Run migrations** (see below)
4. **Set up Discord webhook** (see `DISCORD_WEBHOOK_SETUP.md`)

## Step-by-Step Migration

### 1. Backup Existing Data (if any)

If you have existing data in SQLite:

```bash
cd backend
# Export data
sqlite3 prisma/dev.db <<EOF
.headers on
.mode csv
.output users.csv
SELECT * FROM User;
.output sessions.csv
SELECT * FROM ParkingSession;
.quit
EOF
```

### 2. Update Prisma Schema

The schema has already been updated to use PostgreSQL. Verify:

```bash
cat backend/prisma/schema.prisma
```

Should show:
- `provider = "postgresql"`
- `directUrl = env("DIRECT_URL")`

### 3. Update Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase connection string
```

### 4. Generate Prisma Client

```bash
cd backend
npm run db:generate
```

### 5. Run Migrations

```bash
cd backend
npm run db:migrate
```

This will:
- Connect to Supabase
- Create all tables
- Set up indexes and foreign keys

### 6. Import Data (if you backed up)

If you exported data, you can import it using Supabase SQL Editor or Prisma:

```sql
-- In Supabase SQL Editor
-- Import users.csv and sessions.csv data
-- Adjust SQL syntax as needed for PostgreSQL
```

### 7. Verify Migration

```bash
# Start server
npm run dev

# Test endpoints
curl http://localhost:3001/api/leaderboard
```

## Troubleshooting

### Migration Fails: "relation already exists"

Tables might already exist. Options:

1. **Reset database** (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

2. **Mark migration as applied** (if tables are correct):
```bash
npx prisma migrate resolve --applied 20241203000000_supabase_migration
```

### Connection Errors

- Verify connection string format
- Check password is correct
- Ensure Supabase project is active
- Try adding `?sslmode=require` to connection string

### Data Type Mismatches

PostgreSQL is stricter than SQLite. Common issues:

- **Boolean values**: Use `true`/`false` not `1`/`0`
- **Timestamps**: Ensure proper format
- **Strings**: Check encoding

## Rollback Plan

If you need to rollback:

1. Keep SQLite database as backup
2. Update `.env` to point back to SQLite
3. Change schema back to SQLite
4. Run migrations again

## Next Steps After Migration

1. ✅ Test all API endpoints
2. ✅ Verify Discord webhook works
3. ✅ Test cron job reminders
4. ✅ Update production environment variables
5. ✅ Set up monitoring

## Production Checklist

- [ ] Supabase project created
- [ ] Connection strings configured
- [ ] Migrations run successfully
- [ ] Discord webhook configured
- [ ] Environment variables set in hosting platform
- [ ] SSL certificates configured
- [ ] Monitoring set up
- [ ] Backups configured

