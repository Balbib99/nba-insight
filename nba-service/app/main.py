import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    HealthResponse,
    LeagueLeader,
    PlayerGameLogEntry,
    TeamDetailsResponse,
)
from app.services.nba_stats_service import (
    EmptyNbaStatsResponseError,
    InvalidNbaStatsParameterError,
    NbaStatsServiceError,
    get_league_leaders,
    get_player_game_log,
    get_team_details,
)

load_dotenv()

app = FastAPI(
    title="NBA Insight nba_api Service",
    version="0.1.0",
    description="Safe Python microservice for NBA.com stats data via nba_api.",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:4000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

SeasonType = Literal["Regular Season", "Pre Season", "Playoffs", "All Star"]


def _handle_nba_service_error(error: Exception) -> None:
    if isinstance(error, InvalidNbaStatsParameterError):
        raise HTTPException(status_code=400, detail=str(error)) from error

    if isinstance(error, EmptyNbaStatsResponseError):
        raise HTTPException(status_code=404, detail=str(error)) from error

    if isinstance(error, NbaStatsServiceError):
        raise HTTPException(status_code=502, detail=str(error)) from error

    raise HTTPException(status_code=500, detail="Unexpected nba-service error") from error


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="nba-api-service")


@app.get("/league-leaders", response_model=list[LeagueLeader])
def league_leaders(
    season: str = Query(default="2024-25", min_length=7, max_length=7),
    stat: str = Query(default="PTS", min_length=2, max_length=10),
    season_type: SeasonType = "Regular Season",
) -> list[dict]:
    try:
        return get_league_leaders(season=season, stat=stat, season_type=season_type)
    except Exception as error:
        _handle_nba_service_error(error)


@app.get("/player-gamelog/{player_id}", response_model=list[PlayerGameLogEntry])
def player_gamelog(
    player_id: int,
    season: str = Query(default="2024-25", min_length=7, max_length=7),
    season_type: SeasonType = "Regular Season",
) -> list[dict]:
    try:
        return get_player_game_log(player_id=player_id, season=season, season_type=season_type)
    except Exception as error:
        _handle_nba_service_error(error)


@app.get("/team-details/{team_id}", response_model=TeamDetailsResponse)
def team_details(team_id: int) -> dict:
    try:
        return get_team_details(team_id=team_id)
    except Exception as error:
        _handle_nba_service_error(error)
