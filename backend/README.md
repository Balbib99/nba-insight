# NBA Insight API

Backend base de NBA Insight con Node.js, Express y TypeScript.

## Instalación

```bash
cd backend
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor arranca por defecto en `http://localhost:4000`.

## Producción local

```bash
npm run build
npm start
```

## Endpoints

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado de la API |
| GET | `/api/teams` | Lista de equipos mock |
| GET | `/api/teams/:id` | Equipo por id |
| GET | `/api/players` | Lista de jugadores mock |
| GET | `/api/players/:id` | Jugador por id |
| GET | `/api/stats/players` | Estadísticas mock de jugadores |
| GET | `/api/stats/players/:id` | Estadísticas de un jugador por `playerId` |
