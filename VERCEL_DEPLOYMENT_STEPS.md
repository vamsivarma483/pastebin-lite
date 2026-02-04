# Vercel Deployment Steps

Follow these steps to deploy the Pastebin Lite application to Vercel.

## ✅ Pre-deployment Checklist

- [x] Code committed to git
- [ ] GitHub account created
- [ ] Vercel account created

## Step 1: Push to GitHub

1. **Create a GitHub repository** at https://github.com/new
   - Name it `pastebin-lite`
   - Choose public or private
   - DO NOT initialize with README, .gitignore, or license

2. **Push your code** (replace `YOUR_USERNAME`):
```bash
cd /Users/vamsivarma/pastebin-lite
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your `pastebin-lite` GitHub repository
4. **Framework**: Select "Other"
5. **Root Directory**: `backend`
6. Click "Deploy"

### Backend Environment Variables
After deployment, go to project settings and add:
```
NODE_ENV=production
```

**Backend URL will be**: `https://YOUR_BACKEND_NAME.vercel.app`

## Step 3: Deploy Frontend to Vercel

1. In Vercel dashboard, click "Add New..." → "Project"
2. Select your `pastebin-lite` GitHub repository
3. **Framework**: "Next.js"
4. **Root Directory**: `frontend`
5. **Environment Variables**: Add
```
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_NAME.vercel.app
```
6. Click "Deploy"

**Frontend URL will be**: `https://YOUR_FRONTEND_NAME.vercel.app`

## Step 4: Database (JSON File Storage)

The application currently uses JSON file storage in `/backend/pastes.json` which:
- ✅ Works on Vercel for small deployments
- ✅ Requires no external database
- ❌ Data resets with each deployment
- ❌ Not suitable for production with multiple instances

### To upgrade to PostgreSQL (Optional):

1. Create Vercel Postgres database at https://vercel.com/dashboard/stores
2. Get connection string
3. Update backend `prisma.config.ts` to use PostgreSQL
4. Run migrations with Prisma
5. Redeploy backend

## Step 5: Test Deployment

1. Visit your frontend URL: `https://YOUR_FRONTEND_NAME.vercel.app`
2. Create a paste with:
   - Content: "Test paste"
   - Expiry: Set using the time picker (e.g., 1 hour)
   - Max Views: 5 (optional)
3. Verify the paste URL opens correctly
4. Check remaining views and expiry time display

## Troubleshooting

### "API Connection Refused"
- Check `NEXT_PUBLIC_API_URL` in frontend environment variables
- Verify backend deployment is successful
- Backend URL should be the full domain (e.g., `https://api.vercel.app`)

### "Paste not found"
- The JSON file storage resets on each deployment
- This is normal - create a new paste after deployment
- To persist data, set up PostgreSQL database

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure `npm install` succeeds
- Verify `tsconfig.json` is in backend root

## Monitoring

After deployment:
1. Monitor Vercel analytics dashboard
2. Check function duration and memory usage
3. Set up error alerts in Vercel settings
4. Enable automatic deployments on git push

## Next Steps

- [ ] Push code to GitHub
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Test the deployed application
- [ ] Set up PostgreSQL (optional)
- [ ] Configure custom domain (optional)
