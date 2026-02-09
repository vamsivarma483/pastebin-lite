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

## Step 2: Set Up Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Click on **Storage** in the left sidebar
3. Click **Create Database** → **Postgres**
4. Name it: `pastebin-lite`
5. Select your region
6. Click **Create**
7. Copy the connection string (you'll need this for environment variables)

## Step 3: Deploy Backend

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Import your GitHub repository: `vamsivarma483/pastebin-lite`
4. Select **NestJS** as the framework
5. Configure the project:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `DATABASE_URL`: Paste your Vercel Postgres connection string
   - `NODE_ENV`: `production`
   - `TEST_MODE`: `0`
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app` (set after deploying frontend)
7. Click **Deploy**

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

After the backend is deployed, run Prisma migrations:

```bash
cd backend
npx prisma migrate deploy --skip-generate
```

Or you can use the Vercel CLI:

```bash
npx vercel env pull .env.production.local
npx prisma migrate deploy
```

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
DATABASE_URL=postgresql://...
NODE_ENV=production
TEST_MODE=0
FRONTEND_URL=https://your-frontend-url.vercel.app
```

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
