# NBA Insight API

Backend de NBA Insight con Node.js, Express, TypeScript y PostgreSQL para favoritos.

## Instalación

```bash
cd backend
npm install
```

## Variables de entorno

Crea `backend/.env` usando `backend/.env.example` como referencia:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nba_insight
```

## Crear base de datos local

Con PostgreSQL instalado:

```bash
createdb -U postgres nba_insight
```

O usando `psql`:

```bash
psql -U postgres -c "CREATE DATABASE nba_insight;"
```

## Ejecutar schema.sql

```bash
psql -U postgres -d nba_insight -f src/db/schema.sql
```

Esto crea la tabla `favorites` con una restricción única para evitar duplicados por usuario y jugador.

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
| GET | `/api/favorites/:userId` | Lista de `playerId` favoritos desde PostgreSQL |
| POST | `/api/favorites/:userId` | Añade favorito con body `{ "playerId": "lebron-james" }` |
| DELETE | `/api/favorites/:userId/:playerId` | Elimina favorito |

## Probar favoritos

```bash
curl http://localhost:4000/api/favorites/demo-user
curl -X POST http://localhost:4000/api/favorites/demo-user -H "Content-Type: application/json" -d "{\"playerId\":\"lebron-james\"}"
curl -X DELETE http://localhost:4000/api/favorites/demo-user/lebron-james
```
