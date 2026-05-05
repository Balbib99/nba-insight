from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    service: str


class LeagueLeader(BaseModel):
    playerId: int
    playerName: str
    teamId: int
    teamAbbreviation: str
    gamesPlayed: int
    minutes: float
    points: float
    rebounds: float
    assists: float
    steals: float
    blocks: float
    fieldGoalPct: float
    threePointPct: float
    freeThrowPct: float


class PlayerGameLogEntry(BaseModel):
    gameId: str
    gameDate: str
    matchup: str
    winLoss: str
    minutes: int
    points: int
    rebounds: int
    assists: int
    steals: int
    blocks: int
    turnovers: int
    fgPct: float
    fg3Pct: float
    ftPct: float


class TeamDetailsResponse(BaseModel):
    teamId: int
    abbreviation: str | None = None
    nickname: str | None = None
    city: str | None = None
    arena: str | None = None
    owner: str | None = None
    generalManager: str | None = None
    headCoach: str | None = None
    dLeagueAffiliation: str | None = None
    championships: list[dict] = Field(default_factory=list)
    history: list[dict] = Field(default_factory=list)


class StandingTeam(BaseModel):
    teamId: int
    teamName: str
    teamCity: str
    teamAbbreviation: str
    conference: str
    division: str
    wins: int
    losses: int
    winPct: float
    conferenceRank: int
    divisionRank: int
    homeRecord: str
    awayRecord: str
    lastTen: str
    streak: str
