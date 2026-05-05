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
