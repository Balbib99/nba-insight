export interface TeamStats {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  conferenceRank: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  fieldGoalPct: number;
  threePointPct: number;
}
