# Testing Guide for Pastebin Lite

This guide helps you test all the functionality of the Pastebin Lite application.

## Prerequisites

- Backend running on http://localhost:3001
- Frontend running on http://localhost:3000
- curl or Postman for API testing

## API Testing

### 1. Health Check

```bash
curl http://localhost:3001/api/healthz
# Expected: { "ok": true }
```

### 2. Create a Simple Paste

```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, Pastebin Lite!"
  }'

# Expected response:
# {
#   "id": "abc123xyz",
#   "url": "http://localhost:3000/p/abc123xyz"
# }
```

Save the `id` for the next tests.

### 3. Get Paste Content (API)

```bash
curl http://localhost:3001/api/pastes/abc123xyz

# Expected:
# {
#   "content": "Hello, Pastebin Lite!",
#   "remaining_views": null,
#   "expires_at": null
# }
```

### 4. Create Paste with TTL (30 seconds)

```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This paste expires in 30 seconds",
    "ttl_seconds": 30
  }'
```

Verify it returns before 30 seconds, then try again after 30 seconds - should return 404.

### 5. Create Paste with View Limit

```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This paste can be viewed twice",
    "max_views": 2
  }'

# Save the ID, then call GET endpoint twice - third call returns 404
curl http://localhost:3001/api/pastes/paste_id_here  # 1st view - 200
curl http://localhost:3001/api/pastes/paste_id_here  # 2nd view - 200
curl http://localhost:3001/api/pastes/paste_id_here  # 3rd view - 404
```

### 6. Create Paste with Both TTL and Max Views

```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This paste has both TTL and view limit",
    "ttl_seconds": 60,
    "max_views": 3
  }'

# Should return 404 when EITHER:
# - TTL expires (after 60 seconds)
# - View limit reached (after 3 views)
```

### 7. Test Error Cases

**Empty content:**
```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": ""}'
# Expected: 400 Bad Request
```

**Invalid TTL:**
```bash
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "test", "ttl_seconds": 0}'
# Expected: 400 Bad Request
```

**Non-existent paste:**
```bash
curl http://localhost:3001/api/pastes/nonexistent123
# Expected: 404 Not Found
```

## UI Testing

### 1. Create Paste Via UI

1. Open http://localhost:3000
2. Enter text in the "Paste Content" field
3. Optionally set "Expiry Time" or "Max Views"
4. Click "Create Paste"
5. Verify it redirects to the paste view page

### 2. View Paste Via UI

1. After creating a paste, the app navigates to `/p/:id`
2. Verify the paste content is displayed
3. Check "Expires At" and "Views" information
4. Click "Copy Content" button and verify it copies to clipboard

### 3. Error Handling

1. Try to create a paste with empty content - should show error
2. Try to access a non-existent paste - should show "Paste not found"
3. View a paste, wait for TTL to expire, refresh - should show "Paste not found"
4. View a paste max_views times, try again - should show "Paste not found"

## Deterministic Testing (TEST_MODE)

When `TEST_MODE=1` in backend environment, you can test expiry with a specific timestamp:

```bash
# Create a paste that expires in 1 hour
curl -X POST http://localhost:3001/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test paste",
    "ttl_seconds": 3600
  }'
# Save the ID

# Get current timestamp
date +%s000  # milliseconds since epoch

# Test access with current time (should work)
curl -H "x-test-now-ms: $(date +%s000)" \
  http://localhost:3001/api/pastes/paste_id

# Test access with future timestamp past expiry (should 404)
# Add 3601000 ms (3601 seconds) to current timestamp
curl -H "x-test-now-ms: $(($(date +%s000) + 3601000))" \
  http://localhost:3001/api/pastes/paste_id
# Expected: 404
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Create a test file
echo '{"content": "Test paste"}' > /tmp/paste.json

# Test create endpoint (10 concurrent requests, 100 total)
ab -n 100 -c 10 -p /tmp/paste.json \
  -T application/json \
  http://localhost:3001/api/pastes

# Test health check
ab -n 1000 -c 50 http://localhost:3001/api/healthz
```

### Load Testing with wrk

```bash
# Install wrk if needed: brew install wrk

# Test health check with 4 threads, 100 connections, 30 second duration
wrk -t4 -c100 -d30s http://localhost:3001/api/healthz

# Test get endpoint (requires valid paste ID)
wrk -t4 -c100 -d30s http://localhost:3001/api/pastes/valid_paste_id
```

## Database Testing

### Check Database State

```bash
# Open Prisma Studio
cd backend
npx prisma studio

# Or use SQL directly
sqlite3 dev.db ".tables"
sqlite3 dev.db "SELECT * FROM Paste LIMIT 5;"
```

### Migration Testing

```bash
# Check migration status
npx prisma migrate status

# Rollback last migration
npx prisma migrate resolve --rolled-back create_paste_table

# Replay all migrations
npx prisma migrate deploy
```

## Test Checklist

### Functionality
- [ ] Health check returns 200
- [ ] Create paste without constraints
- [ ] Create paste with TTL
- [ ] Create paste with max views
- [ ] Create paste with both constraints
- [ ] Retrieve paste content via API
- [ ] View paste via HTML page
- [ ] Paste becomes unavailable after TTL
- [ ] Paste becomes unavailable after max views
- [ ] Error on empty content
- [ ] Error on invalid TTL/max_views
- [ ] 404 on non-existent paste

### UI/UX
- [ ] Home page loads
- [ ] Can type in textarea
- [ ] Can set TTL value
- [ ] Can set max views value
- [ ] Create button works
- [ ] Redirects to paste view
- [ ] Paste content displays
- [ ] Copy button works
- [ ] Back button works
- [ ] Error messages display

### Vercel Deployment
- [ ] Frontend deploys successfully
- [ ] Backend deploys successfully
- [ ] Database migrations run
- [ ] Health check works in production
- [ ] Can create paste in production
- [ ] Can view paste in production
- [ ] Frontend can reach backend API
- [ ] CORS works correctly

### Edge Cases
- [ ] Very long paste content
- [ ] Unicode/emoji content
- [ ] HTML/script content (should be safe)
- [ ] Rapid consecutive requests
- [ ] Expired paste requests
- [ ] View limit boundary testing
- [ ] Database performance

## Continuous Testing

### Local Development
```bash
# Run in watch mode
cd backend && npm run start:dev
cd frontend && npm run dev

# Run tests
npm run test

# Run end-to-end tests
npm run test:e2e
```

### Production Monitoring
- Set up Sentry for error tracking
- Configure Vercel analytics
- Monitor database size and performance
- Set up uptime monitoring with tools like UptimeRobot

## Common Test Scenarios

### Scenario 1: Share a Public Paste
1. Create paste without TTL/max_views
2. Share the `/p/:id` link
3. Verify anyone can view it indefinitely

### Scenario 2: Share a Temporary Paste
1. Create paste with `ttl_seconds: 3600`
2. Share link
3. Paste is available for 1 hour
4. Paste becomes unavailable after 1 hour

### Scenario 3: Single-View Secret
1. Create paste with `max_views: 1`
2. Share link
3. First viewer sees the content
4. Second visitor gets 404

### Scenario 4: Limited Time & Views
1. Create with `ttl_seconds: 1800` and `max_views: 3`
2. Becomes unavailable when EITHER expires OR 3 views reached
3. Whichever happens first

## Reporting Issues

If you find bugs during testing, create an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment information
- Any error messages or logs
