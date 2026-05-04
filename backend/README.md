# NBA Insight API

Backend base para NBA Insight. Expone datos mock de equipos, jugadores y estadísticas mediante endpoints REST.

## Instalación

```bash
cd backend
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Por defecto el servidor arranca en `http://localhost:4000`.

Puedes cambiar el puerto con `PORT` y el origen permitido por CORS con `FRONTEND_ORIGIN`.

## Build y producción local

```bash
npm run build
npm start
```

## Endpoints

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado básico de la API |
| GET | `/api/teams` | Lista de equipos mock |
| GET | `/api/teams/:id` | Equipo por id |
| GET | `/api/players` | Lista de jugadores mock |
| GET | `/api/players/:id` | Jugador por id |
| GET | `/api/stats/players` | Estadísticas mock de jugadores |
| GET | `/api/stats/players/:id` | Estadísticas de un jugador por `playerId` |

## Ejemplos

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/teams/lal
curl http://localhost:4000/api/players/lebron-james
curl http://localhost:4000/api/stats/players/lebron-james
```
