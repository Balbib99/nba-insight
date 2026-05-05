# NBA Insight

NBA Insight is a full-stack NBA analytics platform built as a professional portfolio project.

It combines a React/Vite frontend, a Node/Express API gateway, PostgreSQL persistence/cache, and a Python FastAPI microservice for `nba_api` workflows. The frontend is designed to run safely in public demos before the full backend stack is deployed.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router
- Backend: Node, Express, TypeScript
- Database: PostgreSQL for favorites and cache
- Python service: FastAPI with `nba_api`
- External providers: `nba_api` and API-Sports Basketball, both accessed through backend services only

## Features

- Portfolio landing page with architecture overview
- Teams and players directories with detail pages
- Analytics dashboard with real historical leaderboards and demo fallback
- Player comparison lab
- Favorites with backend persistence and frontend fallback mode
- Standings page prepared for API-Sports + PostgreSQL cache
- Historical playoffs and champions page
- Games page prepared for future `GET /api/games?date=YYYY-MM-DD`

## Data modes

The frontend supports three data modes through `VITE_DATA_MODE`.

### `mock`

Always uses local demo data.

Useful for:

- Frontend-only development
- Stable portfolio demos
- Vercel preview without backend

```env
VITE_DATA_MODE=mock
VITE_API_URL=http://localhost:4000
```

### `api`

Always uses the backend API.

Useful for:

- Full-stack local development
- Testing backend errors explicitly
- Validating deployed backend integrations

```env
VITE_DATA_MODE=api
VITE_API_URL=http://localhost:4000
```

### `hybrid`

Tries the backend first and falls back to local demo data if the request fails.

Recommended for public production demos while the backend deployment is still evolving.

```env
VITE_DATA_MODE=hybrid
VITE_API_URL=https://your-backend-url.com
```

If `VITE_DATA_MODE` is missing or invalid, NBA Insight defaults to `hybrid`.

## Production readiness

- Frontend is prepared for Vercel deployment.
- Backend is prepared for a later cloud deployment.
- Demo/historical data keeps the public portfolio usable even when live providers are unavailable.
- React never calls API-Sports or `nba_api` directly.
- External API keys belong only in backend or service environment files.
- The service layer centralizes backend calls and fallback behavior.

## Cloud deployment plan

### Frontend: Vercel

Production variables:

```env
VITE_API_URL=https://your-render-backend.onrender.com
VITE_DATA_MODE=hybrid
```

`hybrid` is recommended for the public portfolio because the frontend tries the backend first and keeps the demo usable with mock/historical fallback data if a backend service is unavailable.

### Backend: Render

Use the `backend/` folder as the Render service root.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Required environment variables:

```env
NODE_ENV=production
DATABASE_URL=<Neon connection string>
DATABASE_SSL=true
FRONTEND_URL=https://your-vercel-app.vercel.app
ADDITIONAL_ALLOWED_ORIGINS=
API_BASKETBALL_KEY=your_api_key_here
```

Optional environment variables:

```env
PYTHON_NBA_SERVICE_URL=https://your-python-service-url
PYTHON_NBA_SERVICE_TIMEOUT_MS=150000
API_BASKETBALL_BASE_URL=https://v1.basketball.api-sports.io
API_BASKETBALL_NBA_LEAGUE_ID=12
API_BASKETBALL_TIMEOUT_MS=15000
API_BASKETBALL_STANDINGS_TTL_HOURS=24
```

If the Python service is not deployed yet, keep `VITE_DATA_MODE=hybrid` on the frontend so the public demo can fall back gracefully where possible.

### Database: Neon PostgreSQL

Create a Neon PostgreSQL database and set Render's `DATABASE_URL` to the Neon connection string.

Run the schema manually:

```bash
psql "$DATABASE_URL" -f backend/src/db/schema.sql
```

Neon requires SSL, so set:

```env
DATABASE_SSL=true
```

## Health checks

Backend API health:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "nba-insight-api",
  "environment": "production",
  "timestamp": "2026-05-05T00:00:00.000Z"
}
```

Database health:

```text
GET /api/health/db
```

Success response:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-05-05T00:00:00.000Z",
  "dbTime": "2026-05-05T00:00:00.000Z"
}
```

Failure response:

```json
{
  "status": "error",
  "database": "disconnected",
  "message": "Database connection failed"
}
```

## Environment variables

Create a local `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:4000

# mock   -> always use local demo data
# api    -> always use backend API
# hybrid -> try backend API first, fallback to mock/demo data
VITE_DATA_MODE=hybrid
```

## Getting started

Install dependencies:

```bash
npm install
```

Run the frontend locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Local development

Backend:

```bash
cd backend
npm install
npm run dev
```

Local backend `.env` example:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nba_insight
DATABASE_SSL=false
FRONTEND_URL=http://localhost:5173
ADDITIONAL_ALLOWED_ORIGINS=
```

Frontend:

```bash
npm install
npm run dev
```

Frontend `.env` example:

```env
VITE_API_URL=http://localhost:4000
VITE_DATA_MODE=hybrid
```

## Project structure

```text
src/
  components/     Reusable UI components
  config/         Frontend configuration and data mode
  context/        Global client state
  data/           Mock and historical local data
  pages/          Route-level pages
  services/       Data access and fallback layer
  types/          TypeScript domain models
backend/
  src/            Node/Express API, PostgreSQL and provider services
nba-service/
  app/            FastAPI service for nba_api
```

## Recommended workflows

Frontend-only demo:

```env
VITE_DATA_MODE=mock
```

Local full-stack development:

```env
VITE_DATA_MODE=api
VITE_API_URL=http://localhost:4000
```

Public Vercel demo before backend deployment:

```env
VITE_DATA_MODE=hybrid
VITE_API_URL=https://your-backend-url.com
```

## Roadmap

- Games/Schedule backend endpoint
- Real-time standings provider in production
- Auth and user accounts
- PostgreSQL cache dashboard
- Advanced player trends
- Full backend deployment
