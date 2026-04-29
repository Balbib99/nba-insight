# NBA Insight

NBA Insight is a modern basketball analytics dashboard built as a frontend portfolio MVP with React, Vite, TypeScript, Tailwind CSS and React Router.

The application currently uses mock NBA data through a service layer. This keeps the UI, routing, comparison logic, favorites flow and analytics structure easy to validate before replacing the data source with a real NBA API.

## Demo

Live demo: _Coming soon_

## Screenshots

Add screenshots after deployment:

- Home / landing page
<img width="1900" height="907" alt="image" src="https://github.com/user-attachments/assets/acbb67df-6a5b-44e4-bb08-4c146246df9a" />

- Players directory
<img width="1897" height="906" alt="image" src="https://github.com/user-attachments/assets/f64b624d-650c-4365-82d6-3056c331decc" />

- Player detail
<img width="1893" height="904" alt="image" src="https://github.com/user-attachments/assets/a1309522-d5a8-42cc-b04a-96fc5e235c18" />

- Team detail
<img width="1895" height="906" alt="image" src="https://github.com/user-attachments/assets/71b53865-d441-4450-96a6-888779e1ac9d" />

- Analytics dashboard
<img width="1894" height="904" alt="image" src="https://github.com/user-attachments/assets/52b84369-9090-4bc4-853c-b3dbf9313fb1" />

- Player comparison
<img width="1889" height="899" alt="image" src="https://github.com/user-attachments/assets/a1005113-b870-44d9-bc8f-af94cc5d45ee" />

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
