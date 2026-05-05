import { teams } from './teams';
import type { RealStanding } from '../types/realStanding';

const recordsByTeam: Record<string, { wins: number; losses: number }> = {
  bos: { wins: 64, losses: 18 },
  nyk: { wins: 50, losses: 32 },
  mil: { wins: 49, losses: 33 },
  cle: { wins: 48, losses: 34 },
  orl: { wins: 47, losses: 35 },
  ind: { wins: 47, losses: 35 },
  phi: { wins: 45, losses: 37 },
  mia: { wins: 44, losses: 38 },
  chi: { wins: 39, losses: 43 },
  atl: { wins: 36, losses: 46 },
  bkn: { wins: 32, losses: 50 },
  tor: { wins: 28, losses: 54 },
  cha: { wins: 24, losses: 58 },
  was: { wins: 15, losses: 67 },
  det: { wins: 14, losses: 68 },
  okc: { wins: 57, losses: 25 },
  den: { wins: 57, losses: 25 },
  min: { wins: 56, losses: 26 },
  lac: { wins: 51, losses: 31 },
  dal: { wins: 50, losses: 32 },
  phx: { wins: 49, losses: 33 },
  nop: { wins: 49, losses: 33 },
  lal: { wins: 47, losses: 35 },
  sac: { wins: 46, losses: 36 },
  gsw: { wins: 46, losses: 36 },
  hou: { wins: 41, losses: 41 },
  uta: { wins: 31, losses: 51 },
  mem: { wins: 27, losses: 55 },
  sas: { wins: 22, losses: 60 },
  por: { wins: 21, losses: 61 },
};

export function getMockStandings(): RealStanding[] {
  const rankedTeams = teams
    .map((team) => {
      const record = recordsByTeam[team.id] ?? { wins: 0, losses: 82 };

      return {
        team,
        record,
      };
    })
    .sort((teamA, teamB) => teamB.record.wins - teamA.record.wins);

  return rankedTeams.map(({ team, record }) => {
    const conferenceRank =
      rankedTeams
        .filter((rankedTeam) => rankedTeam.team.conference === team.conference)
        .findIndex((rankedTeam) => rankedTeam.team.id === team.id) + 1;
    const divisionRank =
      rankedTeams
        .filter((rankedTeam) => rankedTeam.team.division === team.division)
        .findIndex((rankedTeam) => rankedTeam.team.id === team.id) + 1;

    return {
      teamId: Number.parseInt(team.id, 36),
      teamName: team.name,
      teamCity: team.city,
      teamAbbreviation: team.abbreviation,
      conference: team.conference,
      division: team.division,
      wins: record.wins,
      losses: record.losses,
      winPct: record.wins / (record.wins + record.losses),
      conferenceRank,
      divisionRank,
      homeRecord: '-',
      awayRecord: '-',
      lastTen: '-',
      streak: '-',
    };
  });
}
