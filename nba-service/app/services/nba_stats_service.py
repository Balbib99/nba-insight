import math
import os
from typing import Any

import pandas as pd
from nba_api.stats.endpoints.leaguedashteamstats import LeagueDashTeamStats
from nba_api.stats.endpoints.leagueleaders import LeagueLeaders
from nba_api.stats.endpoints.leaguestandingsv3 import LeagueStandingsV3
from nba_api.stats.endpoints.playoffpicture import PlayoffPicture
from nba_api.stats.endpoints.playergamelog import PlayerGameLog
from nba_api.stats.endpoints.teamdetails import TeamDetails
from nba_api.stats.endpoints.teamgamelogs import TeamGameLogs
from nba_api.stats.static import teams as static_teams
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
TEAM_METADATA = {
    "ATL": ("East", "Southeast"),
    "BOS": ("East", "Atlantic"),
    "BKN": ("East", "Atlantic"),
    "CHA": ("East", "Southeast"),
    "CHI": ("East", "Central"),
    "CLE": ("East", "Central"),
    "DAL": ("West", "Southwest"),
    "DEN": ("West", "Northwest"),
    "DET": ("East", "Central"),
    "GSW": ("West", "Pacific"),
    "HOU": ("West", "Southwest"),
    "IND": ("East", "Central"),
    "LAC": ("West", "Pacific"),
    "LAL": ("West", "Pacific"),
    "MEM": ("West", "Southwest"),
    "MIA": ("East", "Southeast"),
    "MIL": ("East", "Central"),
    "MIN": ("West", "Northwest"),
    "NOP": ("West", "Southwest"),
    "NYK": ("East", "Atlantic"),
    "OKC": ("West", "Northwest"),
    "ORL": ("East", "Southeast"),
    "PHI": ("East", "Atlantic"),
    "PHX": ("West", "Pacific"),
    "POR": ("West", "Northwest"),
    "SAC": ("West", "Pacific"),
    "SAS": ("West", "Southwest"),
    "TOR": ("East", "Atlantic"),
    "UTA": ("West", "Northwest"),
    "WAS": ("East", "Southeast"),
}
NBA_STATS_BROWSER_HEADERS = {
    "Host": "stats.nba.com",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Origin": "https://www.nba.com",
    "Referer": "https://www.nba.com/",
    "x-nba-stats-origin": "stats",
    "x-nba-stats-token": "true",
}


def _team_abbreviations() -> dict[int, str]:
    return {
        int(team["id"]): str(team["abbreviation"])
        for team in static_teams.get_teams()
    }


def _team_lookup() -> dict[int, dict[str, str]]:
    return {
        int(team["id"]): {
            "abbreviation": str(team["abbreviation"]),
            "city": str(team["city"]),
            "name": str(team["nickname"]),
        }
        for team in static_teams.get_teams()
    }


def _timeout_seconds() -> int:
    raw_timeout = os.getenv("NBA_API_TIMEOUT_SECONDS", "120")

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


def _validate_season(season: str) -> None:
    if len(season) != 7 or season[4] != "-":
        raise InvalidNbaStatsParameterError("season must use format YYYY-YY")

    start, end = season.split("-")

    if not start.isdigit() or not end.isdigit():
        raise InvalidNbaStatsParameterError("season must use format YYYY-YY")


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


def get_standings(
    season: str = "2025-26",
    season_type: str = "Regular Season",
) -> list[dict[str, Any]]:
    _validate_season(season)
    _validate_season_type(season_type)

    # The official standings endpoints are often slow or blocked by stats.nba.com.
    # TeamGameLogs is slower than a cached standings endpoint, but it is more reliable
    # and still uses real nba_api data to calculate the table.
    return _get_standings_from_team_game_logs(season=season, season_type=season_type)


def _normalize_league_standings(dataframe: pd.DataFrame) -> list[dict[str, Any]]:
    abbreviations = _team_abbreviations()
    standings = []

    for row in dataframe.to_dict(orient="records"):
        team_id = _as_int(row.get("TeamID") or row.get("TEAM_ID"))
        abbreviation = abbreviations.get(team_id, "")

        standings.append(
            {
                "teamId": team_id,
                "teamName": str(row.get("TeamName", "")),
                "teamCity": str(row.get("TeamCity", "")),
                "teamAbbreviation": abbreviation,
                "conference": str(row.get("Conference", "")),
                "division": str(row.get("Division", "")),
                "wins": _as_int(row.get("WINS")),
                "losses": _as_int(row.get("LOSSES")),
                "winPct": _as_float(row.get("WinPCT")),
                "conferenceRank": _as_int(row.get("PlayoffRank") or row.get("ConferenceRank")),
                "divisionRank": _as_int(row.get("DivisionRank")),
                "homeRecord": str(row.get("HOME", "")),
                "awayRecord": str(row.get("ROAD", "")),
                "lastTen": str(row.get("L10", "")),
                "streak": str(row.get("strCurrentStreak") or row.get("CurrentStreak") or ""),
            }
        )

    if not standings:
        raise EmptyNbaStatsResponseError("No standings found")

    return standings


def _season_id(season: str) -> str:
    return f"2{season[:4]}"


def _get_standings_from_playoff_picture(season: str) -> list[dict[str, Any]]:
    try:
        endpoint = PlayoffPicture(
            season_id=_season_id(season),
            timeout=_timeout_seconds(),
        )
        frames = endpoint.get_data_frames()
    except Timeout as error:
        raise NbaStatsServiceError("nba_api playoff picture request timed out") from error
    except RequestException as error:
        raise NbaStatsServiceError(f"stats.nba.com playoff picture request failed: {error}") from error
    except Exception as error:
        raise NbaStatsServiceError(f"nba_api playoff picture failed: {error}") from error

    if len(frames) < 6 or frames[2].empty or frames[5].empty:
        raise EmptyNbaStatsResponseError("No playoff picture standings found")

    lookup = _team_lookup()
    standings = []

    for conference, dataframe in (("East", frames[2]), ("West", frames[5])):
        for row in dataframe.to_dict(orient="records"):
            team_id = _as_int(row.get("TEAM_ID"))
            team = lookup.get(team_id, {})
            abbreviation = team.get("abbreviation", "")
            _, division = TEAM_METADATA.get(abbreviation, (conference, ""))

            standings.append(
                {
                    "teamId": team_id,
                    "teamName": team.get("name", str(row.get("TEAM", ""))),
                    "teamCity": team.get("city", ""),
                    "teamAbbreviation": abbreviation,
                    "conference": conference,
                    "division": division,
                    "wins": _as_int(row.get("WINS")),
                    "losses": _as_int(row.get("LOSSES")),
                    "winPct": _as_float(row.get("PCT")),
                    "conferenceRank": _as_int(row.get("RANK")),
                    "divisionRank": 0,
                    "homeRecord": str(row.get("HOME", "")),
                    "awayRecord": str(row.get("AWAY", "")),
                    "lastTen": "-",
                    "streak": "-",
                }
            )

    if not standings:
        raise EmptyNbaStatsResponseError("No playoff picture standings found")

    return standings


def _get_standings_from_team_stats(
    season: str,
    season_type: str,
) -> list[dict[str, Any]]:
    try:
        endpoint = LeagueDashTeamStats(
            season=season,
            season_type_all_star=season_type,
            per_mode_detailed="Totals",
            timeout=_timeout_seconds(),
        )
        dataframe = _first_dataset(endpoint)
    except Timeout as error:
        raise NbaStatsServiceError("nba_api standings fallback request timed out") from error
    except RequestException as error:
        raise NbaStatsServiceError(f"stats.nba.com standings fallback request failed: {error}") from error
    except Exception as error:
        raise NbaStatsServiceError(f"nba_api standings fallback failed: {error}") from error

    lookup = _team_lookup()
    standings = []

    for row in dataframe.to_dict(orient="records"):
        team_id = _as_int(row.get("TEAM_ID"))
        team = lookup.get(team_id, {})
        abbreviation = team.get("abbreviation", "")
        conference, division = TEAM_METADATA.get(abbreviation, ("", ""))

        standings.append(
            {
                "teamId": team_id,
                "teamName": team.get("name", str(row.get("TEAM_NAME", ""))),
                "teamCity": team.get("city", ""),
                "teamAbbreviation": abbreviation,
                "conference": conference,
                "division": division,
                "wins": _as_int(row.get("W")),
                "losses": _as_int(row.get("L")),
                "winPct": _as_float(row.get("W_PCT")),
                "conferenceRank": 0,
                "divisionRank": 0,
                "homeRecord": "-",
                "awayRecord": "-",
                "lastTen": "-",
                "streak": "-",
            }
        )

    if not standings:
        raise EmptyNbaStatsResponseError("No standings found")

    for conference in ("East", "West"):
        conference_teams = sorted(
            [team for team in standings if team["conference"] == conference],
            key=lambda team: (-team["winPct"], -team["wins"], team["losses"]),
        )

        for index, team in enumerate(conference_teams, start=1):
            team["conferenceRank"] = index

    for division in {team["division"] for team in standings if team["division"]}:
        division_teams = sorted(
            [team for team in standings if team["division"] == division],
            key=lambda team: (-team["winPct"], -team["wins"], team["losses"]),
        )

        for index, team in enumerate(division_teams, start=1):
            team["divisionRank"] = index

    return standings


def _record_from_results(results: list[str]) -> str:
    wins = sum(1 for result in results if result == "W")
    losses = sum(1 for result in results if result == "L")

    return f"{wins}-{losses}"


def _streak_from_recent_results(results: list[str]) -> str:
    if not results:
        return "-"

    first = results[0]
    count = 0

    for result in results:
        if result != first:
            break
        count += 1

    return f"{first}{count}"


def _get_standings_from_team_game_logs(
    season: str,
    season_type: str,
) -> list[dict[str, Any]]:
    try:
        endpoint = TeamGameLogs(
            season_nullable=season,
            season_type_nullable=season_type,
            timeout=_timeout_seconds(),
        )
        dataframe = _first_dataset(endpoint)
    except Timeout as error:
        raise NbaStatsServiceError("nba_api team game logs request timed out") from error
    except RequestException as error:
        raise NbaStatsServiceError(f"stats.nba.com team game logs request failed: {error}") from error
    except Exception as error:
        raise NbaStatsServiceError(f"nba_api team game logs failed: {error}") from error

    if dataframe.empty:
        raise EmptyNbaStatsResponseError("No team game logs found")

    lookup = _team_lookup()
    standings = []

    dataframe = dataframe.sort_values("GAME_DATE", ascending=False)

    for team_id, team_games in dataframe.groupby("TEAM_ID", sort=False):
        team_id_int = _as_int(team_id)
        team = lookup.get(team_id_int, {})
        abbreviation = team.get("abbreviation", str(team_games.iloc[0].get("TEAM_ABBREVIATION", "")))
        conference, division = TEAM_METADATA.get(abbreviation, ("", ""))
        results = [str(result) for result in team_games["WL"].tolist()]
        home_results = [
            str(row["WL"])
            for _, row in team_games.iterrows()
            if " vs. " in str(row.get("MATCHUP", ""))
        ]
        away_results = [
            str(row["WL"])
            for _, row in team_games.iterrows()
            if " @ " in str(row.get("MATCHUP", ""))
        ]
        wins = sum(1 for result in results if result == "W")
        losses = sum(1 for result in results if result == "L")
        games_played = wins + losses

        standings.append(
            {
                "teamId": team_id_int,
                "teamName": team.get("name", str(team_games.iloc[0].get("TEAM_NAME", ""))),
                "teamCity": team.get("city", ""),
                "teamAbbreviation": abbreviation,
                "conference": conference,
                "division": division,
                "wins": wins,
                "losses": losses,
                "winPct": round(wins / games_played, 3) if games_played > 0 else 0,
                "conferenceRank": 0,
                "divisionRank": 0,
                "homeRecord": _record_from_results(home_results),
                "awayRecord": _record_from_results(away_results),
                "lastTen": _record_from_results(results[:10]),
                "streak": _streak_from_recent_results(results),
            }
        )

    if not standings:
        raise EmptyNbaStatsResponseError("No standings found from team game logs")

    for conference in ("East", "West"):
        conference_teams = sorted(
            [team for team in standings if team["conference"] == conference],
            key=lambda team: (-team["winPct"], -team["wins"], team["losses"]),
        )

        for index, team in enumerate(conference_teams, start=1):
            team["conferenceRank"] = index

    for division in {team["division"] for team in standings if team["division"]}:
        division_teams = sorted(
            [team for team in standings if team["division"] == division],
            key=lambda team: (-team["winPct"], -team["wins"], team["losses"]),
        )

        for index, team in enumerate(division_teams, start=1):
            team["divisionRank"] = index

    return standings
