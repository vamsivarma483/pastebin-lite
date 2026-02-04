# Quick Start Guide

## Local Development Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/pastebin-lite.git
cd pastebin-lite

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
```

### 2. Database Setup

For local development, you have two options:

**Option A: SQLite (Quick, no external DB needed)**
```bash
# Update backend/.env to use SQLite
echo 'DATABASE_URL="file:./dev.db"' > backend/.env

# Run migrations
cd backend
npx prisma migrate dev --name init
```

**Option B: PostgreSQL (Production-like)**
```bash
# Install PostgreSQL locally or use Docker
# Then update backend/.env
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/pastebin_lite?schema=public"' > backend/.env

# Run migrations
cd backend
npx prisma migrate dev --name init
```

### 3. Run the Application

Open two terminals:

**Terminal 1: Start Backend**
```bash
cd backend
npm run start:dev
# Server will run on http://localhost:3001
```

**Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
# App will run on http://localhost:3000
```

### 4. Test It Out

1. Open http://localhost:3000
2. Create a paste with some text
3. Click the link to view it
4. Try with TTL or max views

## Vercel Deployment (10 minutes)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deployment Steps

1. Push code to GitHub
2. Create Vercel Postgres database
3. Deploy backend to Vercel (set DATABASE_URL)
4. Deploy frontend to Vercel (set NEXT_PUBLIC_API_URL to backend URL)
5. Run `npx prisma migrate deploy` to set up database
6. Done! 🎉

## Project Structure

```
pastebin-lite/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Pages and layouts
│   │   │   ├── page.tsx  # Home page (create paste)
│   │   │   └── p/[id]/   # Paste view page
│   │   └── lib/
│   │       └── api.ts    # API client
│   └── package.json
├── backend/               # NestJS API
│   ├── src/
│   │   ├── pastes/       # Paste feature
│   │   ├── prisma/       # Database service
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── README.md             # Project overview
└── DEPLOYMENT.md        # Deployment instructions
```

## API Endpoints

All endpoints expect and return JSON.

### Health Check
```
GET /api/healthz
→ { "ok": true }
```

### Create Paste
```
POST /api/pastes
{
  "content": "Hello world",
  "ttl_seconds": 3600,    # optional
  "max_views": 5          # optional
}
→ { "id": "abc123", "url": "https://example.com/p/abc123" }
```

### Get Paste
```
GET /api/pastes/:id
→ {
  "content": "Hello world",
  "remaining_views": 4,  # null if unlimited
  "expires_at": "2026-02-04T12:00:00.000Z"  # null if no expiry
}
```

### View Paste (HTML)
```
GET /p/:id
→ HTML page with paste content
```

## Environment Variables

See `.env.example` files in each directory for all available options.

## Common Tasks

### Debug Database
```bash
cd backend
npx prisma studio
```

### Check Database Status
```bash
cd backend
npx prisma migrate status
```

### Create a New Migration
```bash
cd backend
npx prisma migrate dev --name describe_your_change
```

### Reset Database (⚠️ loses all data)
```bash
cd backend
npx prisma migrate reset
```

## Troubleshooting

**Port already in use**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**Database locked**
```bash
# Reset local database
cd backend
npx prisma migrate reset --force
```

**CORS errors in frontend**
- Check that `NEXT_PUBLIC_API_URL` in frontend/.env.local matches your backend URL
- Ensure backend has CORS enabled (it does by default)

## Next Steps

- [ ] Create GitHub repository
- [ ] Deploy to Vercel (see DEPLOYMENT.md)
- [ ] Set up custom domain
- [ ] Add authentication (optional)
- [ ] Set up monitoring and logging
- [ ] Scale database as needed

## Need Help?

- 📖 [Complete README](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 📝 [API Documentation](#api-endpoints)
