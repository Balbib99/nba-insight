export interface PlayerStats {
  playerId: string;
  playerName: string;
  teamName: string;
  gamesPlayed: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  turnoversPerGame: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
  minutesPerGame: number;
}
