# Vercel Deployment Guide

## Prerequisites
- GitHub account (your repo is already here: https://github.com/vamsivarma483/pastebin-lite)
- Vercel account (sign up at https://vercel.com)
- A PostgreSQL database (Vercel Postgres recommended)

## Step 1: Push Latest Changes to GitHub

```bash
cd /Users/vamsivarma/Pastebin-lite
git add .
git commit -m "Add share link functionality"
git push origin main
```

## Step 2: Set Up Database (Choose ONE Option)

### Option A: Neon (Recommended - Free Tier Available)

**Why Neon?** Serverless PostgreSQL, free tier, automatic scaling, no infrastructure management

1. Go to https://neon.tech and sign up (free tier available)
2. Create a new project:
   - Name: `pastebin-lite`
   - Region: Choose closest to you
3. Get your connection string:
   - Go to **Dashboard** → Your Project → **Connection String**
   - Copy the connection string (looks like: `postgresql://user:password@ep-xxxx.neon.tech/pastebin_lite?sslmode=require`)
   - **Keep this safe - you'll need it for Vercel environment variables**

### Option B: Vercel Postgres (Alternative)

1. Go to https://vercel.com/dashboard
2. Click **Storage** in the left sidebar
3. Click **Create Database** → **Postgres**
4. Name it: `pastebin-lite`
5. Select your region
6. Click **Create**
7. Copy the connection string and keep it safe

### Option C: Other PostgreSQL Providers
- Railway: https://railway.app
- Supabase: https://supabase.com
- AWS RDS
- DigitalOcean

**For this guide, we recommend Neon** ✅

## Step 3: Deploy Backend

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Import your GitHub repository: `vamsivarma483/pastebin-lite`
4. Configure the project:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `DATABASE_URL`: [Your connection string from Step 2 - Neon, Vercel Postgres, etc.]
   - `NODE_ENV`: `production`
   - `TEST_MODE`: `0`
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app` (set after deploying frontend)
6. Click **Deploy**

**Note:** If you get database migration errors on first deploy, that's normal. See "Run Database Migrations" section below.

## Step 4: Deploy Frontend

1. In your Vercel dashboard, click **Add New...** → **Project** again
2. Import the same GitHub repository
3. Select **Next.js** as the framework
4. Configure the project:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-domain.vercel.app/api` (from step 3)
6. Click **Deploy**

## Step 5: Update Backend Environment Variables

After the frontend is deployed:
1. Go back to the backend project settings in Vercel
2. Update `FRONTEND_URL` to your actual frontend URL (e.g., `https://pastebin-lite.vercel.app`)
3. Click **Save** and **Redeploy**

## Step 6: Run Database Migrations

After the backend is deployed, you need to run Prisma migrations to create tables in your database.

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Pull environment variables from Vercel
cd backend
vercel link  # Link to your backend project
vercel env pull

# Run migrations
npx prisma migrate deploy
```

### Option B: Manual (if CLI doesn't work)

```bash
# Get DATABASE_URL from Vercel backend project settings
# Set it locally:
export DATABASE_URL="your-connection-string-here"

# Run migrations
cd backend
npx prisma migrate deploy
```

### Option C: Push Schema (if no migrations exist yet)

```bash
cd backend
npx prisma db push
```

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database at your-db-server

1 migration found in prisma/migrations
✔ Successfully applied 1 migration(s)
```

If you see errors about "Paste" table already existing, that's fine - it means the schema is already set up!

## Monitoring & Testing

- Frontend: `https://your-frontend-domain.vercel.app`
- Backend API: `https://your-backend-domain.vercel.app/api/pastes`

Test creating a paste:
```bash
curl -X POST https://your-backend-domain.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello Vercel!"}'
```

## Troubleshooting

### Database Connection Error
- Ensure the `DATABASE_URL` is correctly set in backend environment variables
- Check that Vercel Postgres is in the same region as your projects

### CORS Issues
- Add environment variable `CORS_ORIGIN` to backend if needed

### Frontend Can't Reach Backend
- Verify `NEXT_PUBLIC_API_URL` points to the correct backend URL
- Check CORS headers in NestJS backend

## Environment Variables Summary

### Backend (Vercel)
```
# Required
DATABASE_URL=postgresql://user:password@your-db-server/pastebin_lite?sslmode=require

# Optional but recommended
NODE_ENV=production
TEST_MODE=0
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Database URL Examples:**
- Neon: `postgresql://user:passwordXX@ep-xxxxxxx.neon.tech/pastebin_lite?sslmode=require`
- Vercel Postgres: `postgresql://default:password@region.postgres.vercel-storage.com/pastebin_lite`
- Railway: `postgresql://user:password@containers-us-west-xx.railway.app:xxxx/pastebin_lite`

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

## Auto-Deploy from Git

Both projects are now configured to auto-deploy whenever you push to GitHub main branch!

```bash
# After making changes locally:
git add .
git commit -m "Your changes"
git push origin main

# Both frontend and backend will automatically deploy to Vercel
```

Enjoy your deployed Pastebin-lite application! 🚀
