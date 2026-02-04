# Pastebin Lite

A simple, share-able text paste application built with Next.js (frontend) and NestJS (backend).

## Features

- ✅ Create text pastes
- ✅ Share pastes via unique URLs
- ✅ Optional time-to-live (TTL) expiry
- ✅ Optional view count limits
- ✅ Health check endpoint
- ✅ Deterministic test mode for automated testing

## Tech Stack

- **Frontend**: Next.js 15+, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Express
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: Prisma

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (for production deployment) or use SQLite for development

## Local Development

### Setup

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# For local development with PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pastebin_lite?schema=public"

# Or for SQLite (no external DB needed):
# DATABASE_URL="file:./dev.db"

NODE_ENV="development"
PORT=3001
TEST_MODE="1"  # Enable test mode with x-test-now-ms header support
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database Setup

Initialize the database with Prisma:

```bash
cd backend
npx prisma migrate dev --name init
```

### Running the Application

In separate terminals:

```bash
# Terminal 1: Start the backend
cd backend
npm run start

# Terminal 2: Start the frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Health Check
```
GET /api/healthz
```

Returns:
```json
{ "ok": true }
```

### Create a Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "Your text here",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

Response:
```json
{
  "id": "paste_id",
  "url": "https://your-domain.com/p/paste_id"
}
```

### Fetch a Paste
```
GET /api/pastes/:id
```

Response:
```json
{
  "content": "Your text here",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

### View a Paste (HTML)
```
GET /p/:id
```

Returns HTML page with paste content.

## Persistence Layer

This application uses **Prisma ORM** with PostgreSQL as the primary persistence layer.

### For Local Development
You can use SQLite for local development by setting:
```
DATABASE_URL="file:./dev.db"
```

### For Production
Deploy with PostgreSQL or use a managed database service like:
- Vercel Postgres
- AWS RDS
- DigitalOcean Managed Databases
- Heroku Postgres

The database schema includes:
- `Paste` model with fields for content, expiry, view count, and max views
- Indexes on `expiresAt` for efficient TTL queries

## Testing

The application supports deterministic testing via the `TEST_MODE` environment variable.

When `TEST_MODE=1`, the backend respects the `x-test-now-ms` header for testing expiry:

```bash
curl -X GET http://localhost:3001/api/pastes/paste_id \
  -H "x-test-now-ms: 1704067200000"
```

## Deployment

### Deploy on Vercel (Recommended)

This monorepo is set up for easy deployment on Vercel with Vercel Postgres as the database.

#### Prerequisites
1. Create a GitHub repository and push this code
2. Create a Vercel account at https://vercel.com
3. Create a Vercel Postgres database

#### Step-by-Step Deployment

**1. Create Vercel Postgres Database**
- Go to https://vercel.com/docs/storage/vercel-postgres
- Create a new Postgres database in Vercel dashboard
- Copy the `POSTGRES_URL` connection string

**2. Deploy Frontend**
- Go to https://vercel.com/new
- Import your GitHub repository
- Select the `/frontend` folder as the root directory
- Add environment variable: `NEXT_PUBLIC_API_URL` = (backend API URL, set after backend deployment)
- Deploy

**3. Deploy Backend**
- Go to https://vercel.com/new
- Import your GitHub repository again
- Select the `/backend` folder as the root directory
- Add environment variables:
  - `DATABASE_URL`: Paste your Vercel Postgres connection string
  - `NODE_ENV`: `production`
  - `TEST_MODE`: `0`
  - `FRONTEND_URL`: Your frontend URL (from step 2)
- Deploy

**4. Update Frontend Environment Variable**
- After backend is deployed, go back to frontend project settings
- Update `NEXT_PUBLIC_API_URL` to your backend URL (e.g., `https://your-backend.vercel.app`)
- Redeploy frontend

**5. Run Database Migration**
After backend deployment, you need to run the Prisma migration on Vercel Postgres:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Run migration in production
vercel env pull
npx prisma migrate deploy
```

Or use the Vercel UI to run a build-time migration by adding this to `backend/package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate && prisma migrate deploy"
  }
}
```

#### Vercel Project Structure

After deployment, you'll have two separate Vercel projects:
- **pastebin-lite-frontend**: Next.js application
- **pastebin-lite-backend**: NestJS API

This allows independent scaling and management of frontend and backend.

## Project Structure

```
pastebin-lite/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── lib/               # Utilities and API functions
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── pastes/            # Paste feature
│   │   ├── prisma/            # Database service
│   │   ├── app.controller.ts  # Health check
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   └── ...
└── README.md
```

## Design Decisions

1. **Monorepo Structure**: Kept frontend and backend in separate folders within one repo for easier development
2. **NestJS + Next.js**: Chose these frameworks for their robustness, type safety, and excellent documentation
3. **Prisma ORM**: Provides type-safe database access and easy migrations
4. **PostgreSQL**: Chosen for production as it's battle-tested and widely supported
5. **TTL and View Logic**: Implemented in backend service layer for consistency
6. **Deterministic Testing**: Uses `x-test-now-ms` header to allow predictable testing of expiry logic

## License

MIT
