import math
import os
from typing import Any

import pandas as pd
from nba_api.stats.endpoints.leagueleaders import LeagueLeaders
from nba_api.stats.endpoints.playergamelog import PlayerGameLog
from nba_api.stats.endpoints.teamdetails import TeamDetails
from requests import RequestException, Timeout


class NbaStatsServiceError(Exception):
    """Base error for nba_api integration failures."""


class EmptyNbaStatsResponseError(NbaStatsServiceError):
    """Raised when stats.nba.com returns no useful rows."""


class InvalidNbaStatsParameterError(NbaStatsServiceError):
    """Raised when a caller provides unsupported endpoint parameters."""


VALID_LEADER_STATS = {
    "PTS",
    "REB",
    "AST",
    "STL",
    "BLK",
    "FG_PCT",
    "FG3_PCT",
    "FT_PCT",
    "MIN",
    "EFF",
}
VALID_SEASON_TYPES = {"Regular Season", "Pre Season", "Playoffs", "All Star"}


def _timeout_seconds() -> int:
    raw_timeout = os.getenv("NBA_API_TIMEOUT_SECONDS", "30")

    try:
        return int(raw_timeout)
    except ValueError:
        return 30


def _clean_value(value: Any) -> Any:
    if pd.isna(value):
        return None

    if isinstance(value, float) and math.isfinite(value):
        return round(value, 3)

    return value


def _records_from_dataframe(dataframe: pd.DataFrame) -> list[dict[str, Any]]:
    return [
        {str(key): _clean_value(value) for key, value in record.items()}
        for record in dataframe.to_dict(orient="records")
    ]


def _first_dataset(endpoint: Any) -> pd.DataFrame:
    frames = endpoint.get_data_frames()

    if not frames or frames[0].empty:
        raise EmptyNbaStatsResponseError("nba_api returned an empty response")

    return frames[0]


def _as_int(value: Any, default: int = 0) -> int:
    if value is None or pd.isna(value):
        return default

    return int(value)


def _as_float(value: Any, default: float = 0.0) -> float:
    if value is None or pd.isna(value):
        return default

    return round(float(value), 3)


def _validate_season_type(season_type: str) -> None:
    if season_type not in VALID_SEASON_TYPES:
        raise InvalidNbaStatsParameterError(f"Unsupported season_type: {season_type}")


def get_league_leaders(
    season: str = "2024-25",
    stat: str = "PTS",
    season_type: str = "Regular Season",
) -> list[dict[str, Any]]:
    normalized_stat = stat.upper()
    _validate_season_type(season_type)

    if normalized_stat not in VALID_LEADER_STATS:
        raise InvalidNbaStatsParameterError(f"Unsupported stat: {stat}")

    try:
        endpoint = LeagueLeaders(
            season=season,
            season_type_all_star=season_type,
            stat_category_abbreviation=normalized_stat,
            per_mode48="PerGame",
            timeout=_timeout_seconds(),
        )
        dataframe = _first_dataset(endpoint)
    except Timeout as error:
        raise NbaStatsServiceError("nba_api request timed out") from error
    except RequestException as error:
        raise NbaStatsServiceError("stats.nba.com request failed") from error

    leaders = []

    for row in dataframe.to_dict(orient="records"):
        leaders.append(
            {
                "playerId": _as_int(row.get("PLAYER_ID")),
                "playerName": str(row.get("PLAYER", "")),
                "teamId": _as_int(row.get("TEAM_ID")),
                "teamAbbreviation": str(row.get("TEAM", "")),
                "gamesPlayed": _as_int(row.get("GP")),
                "minutes": _as_float(row.get("MIN")),
                "points": _as_float(row.get("PTS")),
                "rebounds": _as_float(row.get("REB")),
                "assists": _as_float(row.get("AST")),
                "steals": _as_float(row.get("STL")),
                "blocks": _as_float(row.get("BLK")),
                "fieldGoalPct": _as_float(row.get("FG_PCT")),
                "threePointPct": _as_float(row.get("FG3_PCT")),
                "freeThrowPct": _as_float(row.get("FT_PCT")),
            }
        )

    if not leaders:
        raise EmptyNbaStatsResponseError("No league leaders found")

    return leaders


def get_player_game_log(
    player_id: int,
    season: str = "2024-25",
    season_type: str = "Regular Season",
) -> list[dict[str, Any]]:
    _validate_season_type(season_type)

    if player_id <= 0:
        raise InvalidNbaStatsParameterError("player_id must be greater than zero")

    try:
        endpoint = PlayerGameLog(
            player_id=player_id,
            season=season,
            season_type_all_star=season_type,
            timeout=_timeout_seconds(),
        )
        dataframe = _first_dataset(endpoint)
    except Timeout as error:
        raise NbaStatsServiceError("nba_api request timed out") from error
    except RequestException as error:
        raise NbaStatsServiceError("stats.nba.com request failed") from error

    games = []

    for row in dataframe.to_dict(orient="records"):
        games.append(
            {
                "gameId": str(row.get("Game_ID", "")),
                "gameDate": str(row.get("GAME_DATE", "")),
                "matchup": str(row.get("MATCHUP", "")),
                "winLoss": str(row.get("WL", "")),
                "minutes": _as_int(row.get("MIN")),
                "points": _as_int(row.get("PTS")),
                "rebounds": _as_int(row.get("REB")),
                "assists": _as_int(row.get("AST")),
                "steals": _as_int(row.get("STL")),
                "blocks": _as_int(row.get("BLK")),
                "turnovers": _as_int(row.get("TOV")),
                "fgPct": _as_float(row.get("FG_PCT")),
                "fg3Pct": _as_float(row.get("FG3_PCT")),
                "ftPct": _as_float(row.get("FT_PCT")),
            }
        )

    if not games:
        raise EmptyNbaStatsResponseError("No player game log found")

    return games


def get_team_details(team_id: int) -> dict[str, Any]:
    if team_id <= 0:
        raise InvalidNbaStatsParameterError("team_id must be greater than zero")

    try:
        endpoint = TeamDetails(team_id=team_id, timeout=_timeout_seconds())
        frames = endpoint.get_data_frames()
    except Timeout as error:
        raise NbaStatsServiceError("nba_api request timed out") from error
    except RequestException as error:
        raise NbaStatsServiceError("stats.nba.com request failed") from error

    if not frames or frames[0].empty:
        raise EmptyNbaStatsResponseError("No team details found")

    background = frames[0].to_dict(orient="records")[0]
    history = _records_from_dataframe(frames[1]) if len(frames) > 1 and not frames[1].empty else []
    championships = _records_from_dataframe(frames[2]) if len(frames) > 2 and not frames[2].empty else []

    return {
        "teamId": _as_int(background.get("TEAM_ID") or team_id),
        "abbreviation": background.get("ABBREVIATION"),
        "nickname": background.get("NICKNAME"),
        "city": background.get("CITY"),
        "arena": background.get("ARENA"),
        "owner": background.get("OWNER"),
        "generalManager": background.get("GENERALMANAGER"),
        "headCoach": background.get("HEADCOACH"),
        "dLeagueAffiliation": background.get("DLEAGUEAFFILIATION"),
        "championships": championships,
        "history": history,
    }
