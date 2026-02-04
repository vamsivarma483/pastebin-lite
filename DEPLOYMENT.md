# Deployment Guide for Pastebin Lite

This guide walks through deploying the Pastebin Lite application to Vercel with Vercel Postgres.

## Prerequisites

- GitHub account and repository with this code pushed
- Vercel account (sign up at https://vercel.com)
- Basic understanding of environment variables

## Architecture

The application is deployed as two separate Vercel projects:
- **Frontend**: Next.js application
- **Backend**: NestJS API with PostgreSQL

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  https://pastebin-lite.vercel.app      │
│                                         │
│  Next.js Application                    │
│  - Create Paste UI                      │
│  - View Paste UI                        │
└──────────────┬──────────────────────────┘
               │ API calls
┌──────────────▼──────────────────────────┐
│         Vercel (Backend)                │
│  https://api.pastebin-lite.vercel.app  │
│                                         │
│  NestJS API                             │
│  - POST /api/pastes                     │
│  - GET /api/pastes/:id                  │
│  - GET /api/healthz                     │
└──────────────┬──────────────────────────┘
               │ Database connection
┌──────────────▼──────────────────────────┐
│    Vercel Postgres Database             │
│  postgresql://...@vercel.com:5432/...  │
└─────────────────────────────────────────┘
```

## Step 1: Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Click "Storage" in the sidebar
3. Click "Create Database"
4. Select "Postgres"
5. Give it a name like "pastebin-lite"
6. Select a region close to you
7. Click "Create"
8. Go to the database settings and copy the full `POSTGRES_URL` connection string
   - Save this somewhere safe - you'll need it for both frontend and backend deployment

## Step 2: Push Code to GitHub

Make sure your code is pushed to a GitHub repository:

```bash
git remote add origin https://github.com/your-username/pastebin-lite.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Under "Import Project":
   - Set **Root Directory** to `./backend`
   - Click "Continue"
5. Name the project: `pastebin-lite-backend` (or similar)
6. Under **Environment Variables**, add:
   - `DATABASE_URL`: Paste your POSTGRES_URL from Step 1
   - `NODE_ENV`: `production`
   - `TEST_MODE`: `0`
   - `FRONTEND_URL`: (Leave blank for now, update after frontend deployment)
7. Click "Deploy"
8. Wait for deployment to complete (5-10 minutes)
9. Note the backend URL, e.g., `https://pastebin-lite-backend.vercel.app`

## Step 4: Deploy Frontend

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Under "Import Project":
   - Set **Root Directory** to `./frontend`
   - Click "Continue"
5. Name the project: `pastebin-lite-frontend` (or similar)
6. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Step 3, e.g., `https://pastebin-lite-backend.vercel.app`
7. Click "Deploy"
8. Wait for deployment to complete (3-5 minutes)
9. Note the frontend URL, e.g., `https://pastebin-lite-frontend.vercel.app`

## Step 5: Update Backend Environment Variables

1. Go to your backend Vercel project settings
2. Find **Environment Variables**
3. Update `FRONTEND_URL` to your frontend URL from Step 4
4. Click the three-dot menu and select **Redeploy**

## Step 6: Run Database Migration

The database schema needs to be applied to Vercel Postgres:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to backend directory
cd backend

# Link to your Vercel project
vercel link

# Pull environment variables
vercel env pull

# Run migration
npx prisma migrate deploy
```

### Option B: Using Vercel Dashboard

Add a postinstall script to auto-run migrations:

1. Go to backend Vercel project settings
2. Find **Build & Development Settings**
3. Set **Build Command** to:
   ```
   npm run build && npx prisma migrate deploy
   ```
4. Redeploy

## Step 7: Test the Application

1. Open your frontend URL in a browser
2. Try creating a paste
3. Verify the paste is created and returns a shareable link
4. Visit the link to view the paste
5. Test TTL and max_views constraints

## Troubleshooting

### Backend returns 404

- Check that `NEXT_PUBLIC_API_URL` in frontend matches your backend URL
- Redeploy frontend after updating

### Database connection errors

- Verify `DATABASE_URL` is correctly set in backend environment
- Check that the database is running and accessible
- Use `vercel env pull` to sync environment variables locally

### Prisma migration fails

```bash
# Check migration status
cd backend
npx prisma migrate status

# If needed, resolve conflicts
npx prisma migrate resolve --rolled-back <migration_name>

# Retry migration
npx prisma migrate deploy
```

### CORS errors

- Ensure backend has `enableCors()` enabled (it does in the code)
- Check that `FRONTEND_URL` is set correctly in backend

## Scaling and Optimization

### Performance
- Vercel automatically scales the frontend and backend
- Use Vercel Analytics to monitor performance
- Optimize database queries with Prisma

### Costs
- Vercel Postgres has a free tier (up to 1 million rows)
- Monitor database size in Vercel dashboard
- Set up cost alerts in your Vercel account

### Monitoring
- Use Vercel's built-in monitoring for deployments
- Set up error tracking with Sentry for production
- Monitor database with Prisma Studio:
  ```bash
  npx prisma studio
  ```

## Environment Variables Reference

### Backend (.env)
```
DATABASE_URL=postgresql://...     # Vercel Postgres connection string
NODE_ENV=production               # Set to production
PORT=3001                         # Don't change, Vercel uses dynamic ports
TEST_MODE=0                       # 0 for production, 1 for testing
FRONTEND_URL=https://...          # Your frontend domain
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://...   # Your backend domain
```

## Reverting to Local Development

To run locally with PostgreSQL:

1. Install PostgreSQL locally or use Docker
2. Create a local database:
   ```bash
   createdb pastebin_lite
   ```
3. Update backend `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/pastebin_lite?schema=public"
   ```
4. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```
5. Start backend and frontend:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run start:dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

## Support

For issues with:
- **Vercel deployment**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **NestJS**: https://docs.nestjs.com
- **Prisma**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs
