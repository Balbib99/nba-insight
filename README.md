# NBA Insight

NBA Insight is a modern basketball analytics dashboard built as a frontend portfolio MVP with React, Vite, TypeScript, Tailwind CSS and React Router.

The application currently uses mock NBA data through a service layer. This keeps the UI, routing, comparison logic, favorites flow and analytics structure easy to validate before replacing the data source with a real NBA API.

## Demo

Live demo: _Coming soon_

## Screenshots

Add screenshots after deployment:

- Home / landing page
- Players directory
- Player detail
- Team detail
- Analytics dashboard
- Player comparison

## Features

- Responsive landing page for portfolio presentation
- Teams directory with filters and dynamic team detail pages
- Players directory with search, filters and dynamic player detail pages
- Advanced analytics dashboard using mock player statistics
- Player comparison page with automatic stat winners
- Favorites system persisted with localStorage
- Service layer prepared for future API integration
- Loading, error and empty states across data-driven pages

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
- Local Storage
- Mock data service layer

## Project Structure

```text
src/
  components/     Reusable UI components
  context/        Global client state, including favorites
  data/           Mock teams, players and statistics
  pages/          Route-level pages
  services/       Data access layer
  types/          TypeScript domain models
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

## Current Status

This is a frontend-only MVP. It does not include a backend, authentication, database or real NBA API integration yet.

Current data is mock data stored locally in the project and exposed through `src/services/nbaService.ts`.

## Roadmap

- Real NBA API integration
- Backend with Node/Express or similar
- PostgreSQL database
- Authentication
- Cloud-synced user favorites
- Personalized dashboards
- Deployment pipeline

## Environment Variables

No environment variables are required for the current mock-data version.

See `.env.example` for future API configuration placeholders.
