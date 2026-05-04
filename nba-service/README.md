# NBA Insight nba_api Service

Microservicio Python independiente para consultar datos reales de NBA.com/stats.nba.com mediante `nba_api`.

Arquitectura prevista:

```text
Frontend React -> Backend Node/Express -> Microservicio Python FastAPI -> nba_api
```

La app principal puede seguir funcionando aunque este servicio no este levantado.

## Version de Python

Usa Python 3.12 para este servicio.

En Windows, `nba_api==1.6.1` puede instalar `numpy 1.26.4`. Esa version de `numpy` tiene wheels para Python 3.12, pero no para Python 3.13/3.14. Si usas una version demasiado nueva de Python, `pip` intenta compilar `numpy` desde cero y falla si no tienes compiladores de Visual Studio.

Comprueba la version dentro del entorno virtual:

```bash
python --version
```

Debe mostrar algo como:

```text
Python 3.12.x
```

## Crear entorno virtual

Desde la raiz del proyecto:

```bash
cd nba-service
python -m venv .venv
```

Si tienes varias versiones instaladas, crea el entorno explicitamente con Python 3.12:

```bash
py -3.12 -m venv .venv
```

Activar en PowerShell:

```bash
.\.venv\Scripts\Activate.ps1
```

Activar en macOS/Linux:

```bash
source .venv/bin/activate
```

## Instalar dependencias

```bash
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

## Variables de entorno

Copia `.env.example` a `.env` si quieres ajustar configuracion:

```env
NBA_API_TIMEOUT_SECONDS=30
ALLOWED_ORIGINS=http://localhost:4000
```

## Arrancar servicio

```bash
uvicorn app.main:app --reload --port 8000
```

Servicio local:

```text
http://localhost:8000
```

Documentacion automatica:

```text
http://localhost:8000/docs
```

## Endpoints

### GET /health

```bash
curl http://localhost:8000/health
```

Devuelve:

```json
{
  "status": "ok",
  "service": "nba-api-service"
}
```

### GET /league-leaders

Query params:

- `season`: por defecto `2024-25`
- `stat`: por defecto `PTS`
- `season_type`: por defecto `Regular Season`

Ejemplo:

```bash
curl "http://localhost:8000/league-leaders?season=2024-25&stat=PTS&season_type=Regular%20Season"
```

Devuelve una lista normalizada de lideres con `playerId`, `playerName`, equipo, partidos, minutos y estadisticas por partido.

### GET /player-gamelog/{player_id}

Ejemplo con LeBron James:

```bash
curl "http://localhost:8000/player-gamelog/2544?season=2024-25&season_type=Regular%20Season"
```

Devuelve partidos normalizados con fecha, matchup, resultado, minutos, puntos, rebotes, asistencias y porcentajes.

### GET /team-details/{team_id}

Ejemplo con Los Angeles Lakers:

```bash
curl http://localhost:8000/team-details/1610612747
```

Devuelve datos normalizados del equipo y, cuando NBA.com los incluya, historial y campeonatos.

## Errores

El servicio normaliza errores basicos:

- `400`: parametros invalidos.
- `404`: nba_api responde sin datos utiles.
- `502`: timeout o error de stats.nba.com.
- `500`: error inesperado del microservicio.
