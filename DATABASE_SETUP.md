# Database Setup Guide

This guide covers setting up different database options for local development and production deployment.

## Quick Start Options

### 🚀 Easiest: Neon (Recommended)

**Why Neon?**
- ✅ Free tier with generous limits
- ✅ No local setup needed
- ✅ Works everywhere (local + Vercel)
- ✅ Serverless PostgreSQL
- ✅ Automatic backups

**Steps:**
1. Go to https://neon.tech and sign up (free)
2. Create project → Get connection string
3. Update `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxxx.neon.tech/pastebin_lite?sslmode=require"
   ```
4. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

---

## All Database Options

### Option 1: Neon (Serverless PostgreSQL) ⭐

**Best for:** Development + Production (Vercel)

```bash
# 1. Sign up
# https://neon.tech

# 2. Create project and get connection string
# Copy: postgresql://user:password@ep-xxxx.neon.tech/pastebin_lite?sslmode=require

# 3. Update .env
DATABASE_URL="postgresql://user:password@ep-xxxx.neon.tech/pastebin_lite?sslmode=require"

# 4. Run migrations
cd backend
npx prisma migrate dev
```

---

### Option 2: Vercel Postgres

**Best for:** Vercel deployments

```bash
# 1. Go to Vercel Dashboard → Storage → Create Database → Postgres
# 2. Copy connection string
# 3. Update .env
DATABASE_URL="postgresql://default:password@region.postgres.vercel-storage.com/pastebin_lite"

# 4. Run migrations
cd backend
npx prisma migrate dev
```

---

### Option 3: Local PostgreSQL

**Best for:** Local development only (macOS)

```bash
# 1. Install PostgreSQL via Homebrew
brew install postgresql@15

# 2. Start PostgreSQL service
brew services start postgresql@15

# 3. Create database
createdb pastebin_lite

# 4. Update .env
DATABASE_URL="postgresql://postgres:@localhost:5432/pastebin_lite"

# 5. Run migrations
cd backend
npx prisma migrate dev
```

**Note:** This won't work on Vercel (localhost doesn't exist on Vercel servers)

---

### Option 4: Docker PostgreSQL

**Best for:** Isolated local development

```bash
# 1. Start PostgreSQL container
docker run -d \
  --name pastebin-postgres \
  -e POSTGRES_DB=pastebin_lite \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16

# 2. Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pastebin_lite"

# 3. Run migrations
cd backend
npx prisma migrate dev

# 4. Stop container later
docker stop pastebin-postgres
```

---

### Option 5: Railway

**Best for:** Simple production deployments

```bash
# 1. Go to https://railway.app
# 2. Create project → Add Postgres service
# 3. Get connection string from Variables tab
# 4. Update .env
DATABASE_URL="postgresql://user:password@containers-us-west-xx.railway.app:xxxx/pastebin_lite"

# 5. Run migrations
cd backend
npx prisma migrate dev
```

---

### Option 6: Supabase

**Best for:** Full-featured PostgreSQL with extras

```bash
# 1. Go to https://supabase.com
# 2. Create project
# 3. Get connection string from Project Settings → Database
# 4. Update .env
DATABASE_URL="postgresql://postgres:password@region.supabase.co:5432/postgres"

# 5. Run migrations
cd backend
npx prisma migrate dev
```

---

## Verification

After setting up your database, verify it works:

```bash
cd backend

# Test connection
npx prisma db execute --stdin < /dev/null

# View database
npx prisma studio

# Run migrations
npx prisma migrate dev

# Check schema
npx prisma db push
```

---

## Migration Commands Reference

```bash
# Create and run a new migration
npx prisma migrate dev --name add_feature

# Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data!)
npx prisma migrate reset

# View database in UI
npx prisma studio

# Generate Prisma client
npx prisma generate
```

---

## Production Deployment Checklist

When deploying to Vercel:

- [ ] Use Neon, Vercel Postgres, or similar serverless DB
- [ ] Set `DATABASE_URL` environment variable in Vercel
- [ ] Run `npx prisma migrate deploy` after first deployment
- [ ] Verify database migrations applied successfully
- [ ] Test creating and viewing pastes in production

---

## Troubleshooting

### Connection Refused
- Check if database server is running
- Verify connection string is correct
- Check firewall/network settings

### SSL/TLS Errors
- Add `?sslmode=require` to connection string for remote databases
- Local databases usually don't need this

### Migration Already Applied
- Run `npx prisma migrate resolve --rolled-back [migration-name]`
- Or manually check `_prisma_migrations` table

### "Database does not exist"
- Create the database first (check your database provider)
- Run `npx prisma db push` or `npx prisma migrate deploy`

---

## Recommended Setup

### For Development
**Use Neon** (or Docker)
- No local installation needed
- Works everywhere
- Free tier is generous

### For Production (Vercel)
**Use Neon** (or Vercel Postgres)
- Vercel Postgres integrates directly
- Neon works great and is cheaper at scale
- Both have good performance

### Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?[options]
```

Example Neon:
```
postgresql://neon_user:neon_password@ep-xxx.neon.tech/pastebin_lite?sslmode=require
```

---

Need help? Check the main VERCEL_DEPLOYMENT_STEPS.md for full deployment guide!
