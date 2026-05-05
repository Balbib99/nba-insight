export type RealStandingConference = 'East' | 'West';

export interface RealStanding {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamAbbreviation: string;
  conference: RealStandingConference | string;
  division: string;
  wins: number;
  losses: number;
  winPct: number;
  conferenceRank: number;
  divisionRank: number;
  homeRecord: string;
  awayRecord: string;
  lastTen: string;
  streak: string;
}
