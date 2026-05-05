# NBA Insight API

Backend de NBA Insight con Node.js, Express, TypeScript y PostgreSQL.

Este backend sirve datos mock propios, gestiona favoritos en PostgreSQL y expone datos reales a traves de integraciones externas. El frontend debe llamar siempre a este backend, nunca directamente a Python ni a API-Sports.

## Instalacion

```bash
cd backend
npm install
```

## Variables de entorno

Crea `backend/.env` usando `backend/.env.example` como referencia:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nba_insight
PYTHON_NBA_SERVICE_URL=http://localhost:8000
PYTHON_NBA_SERVICE_TIMEOUT_MS=150000
API_BASKETBALL_KEY=tu_api_key
API_BASKETBALL_BASE_URL=https://v1.basketball.api-sports.io
API_BASKETBALL_NBA_LEAGUE_ID=12
API_BASKETBALL_TIMEOUT_MS=15000
API_BASKETBALL_STANDINGS_TTL_HOURS=24
```

`API_BASKETBALL_NBA_LEAGUE_ID` debe ser el id de la NBA en API-Sports Basketball. En esta fase usamos `12` como valor configurado, pero si la cuenta/documentacion muestra otro id, cambia solo esta variable.

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

Esto crea:

- `favorites`: favoritos por usuario y jugador.
- `standings_cache`: cache de clasificaciones reales de API-Sports para reducir llamadas externas.

El endpoint de standings tambien crea `standings_cache` automaticamente si la tabla no existe, pero ejecutar el schema sigue siendo la forma recomendada.

## Desarrollo

```bash
npm run dev
```

El servidor arranca por defecto en `http://localhost:4000`.

## Produccion local

```bash
npm run build
npm start
```

## Endpoints

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/health` | Estado de la API |
| GET | `/api/teams` | Lista de equipos mock |
| GET | `/api/teams/:id` | Equipo por id |
| GET | `/api/players` | Lista de jugadores mock |
| GET | `/api/players/:id` | Jugador por id |
| GET | `/api/stats/players` | Estadisticas mock de jugadores |
| GET | `/api/stats/players/:id` | Estadisticas de un jugador por `playerId` |
| GET | `/api/favorites/:userId` | Lista de `playerId` favoritos desde PostgreSQL |
| POST | `/api/favorites/:userId` | Anade favorito con body `{ "playerId": "lebron-james" }` |
| DELETE | `/api/favorites/:userId/:playerId` | Elimina favorito |
| GET | `/api/real/health` | Comprueba conexion con el microservicio Python |
| GET | `/api/real/league-leaders` | Lideres reales desde `nba_api` via Python |
| GET | `/api/real/player-gamelog/:playerId` | Game log real de un jugador via Python |
| GET | `/api/real/team-details/:teamId` | Detalles reales de equipo via Python |
| GET | `/api/real/standings` | Endpoint experimental antiguo de standings via Python |
| GET | `/api/standings` | Clasificacion NBA real desde API-Sports con cache PostgreSQL |

## Probar favoritos

```bash
curl http://localhost:4000/api/favorites/demo-user
curl -X POST http://localhost:4000/api/favorites/demo-user -H "Content-Type: application/json" -d "{\"playerId\":\"lebron-james\"}"
curl -X DELETE http://localhost:4000/api/favorites/demo-user/lebron-james
```

## Microservicio Python nba_api

Configura la URL del servicio Python en `backend/.env`:

```env
PYTHON_NBA_SERVICE_URL=http://localhost:8000
```

Con `nba-service` levantado en el puerto `8000`, puedes probar la integracion desde Node:

```bash
curl http://localhost:4000/api/real/health
curl "http://localhost:4000/api/real/league-leaders?season=2024-25&stat=PTS&season_type=Regular%20Season"
curl "http://localhost:4000/api/real/player-gamelog/2544?season=2024-25&season_type=Regular%20Season"
curl http://localhost:4000/api/real/team-details/1610612747
```

## API-Sports Basketball standings

La ruta estable para clasificaciones es:

```bash
curl "http://localhost:4000/api/standings?season=2025-26"
```

Flujo:

```text
Frontend /standings -> Node /api/standings -> PostgreSQL cache -> API-Sports Basketball
```

La primera llamada de una temporada consulta API-Sports y guarda el resultado. Las siguientes llamadas usan cache mientras no haya caducado el TTL configurado con `API_BASKETBALL_STANDINGS_TTL_HOURS`.

Para forzar refresco manual:

```bash
curl "http://localhost:4000/api/standings?season=2025-26&forceRefresh=true"
```

Usa `forceRefresh=true` solo cuando quieras gastar una llamada externa a proposito.
