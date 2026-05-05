export type GameStatus = 'scheduled' | 'live' | 'final';

export interface GameTeam {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  logo?: string;
  record?: string;
  score?: number;
}

export interface Game {
  id: string;
  date: string;
  time: string;
  status: GameStatus;
  arena: string;
  city: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  period?: string;
  clock?: string;
  notes?: string;
}

export const gamesMock: Game[] = [
  {
    id: 'game-2026-05-04-bos-nyk',
    date: '2026-05-04',
    time: '19:30',
    status: 'final',
    arena: 'Madison Square Garden',
    city: 'New York, NY',
    awayTeam: {
      id: 'bos',
      name: 'Celtics',
      abbreviation: 'BOS',
      city: 'Boston',
      record: '56-26',
      score: 112,
    },
    homeTeam: {
      id: 'nyk',
      name: 'Knicks',
      abbreviation: 'NYK',
      city: 'New York',
      record: '51-31',
      score: 106,
    },
    notes: 'Demo historical matchup',
  },
  {
    id: 'game-2026-05-04-den-phx',
    date: '2026-05-04',
    time: '22:00',
    status: 'final',
    arena: 'Footprint Center',
    city: 'Phoenix, AZ',
    awayTeam: {
      id: 'den',
      name: 'Nuggets',
      abbreviation: 'DEN',
      city: 'Denver',
      record: '53-29',
      score: 118,
    },
    homeTeam: {
      id: 'phx',
      name: 'Suns',
      abbreviation: 'PHX',
      city: 'Phoenix',
      record: '49-33',
      score: 114,
    },
  },
  {
    id: 'game-2026-05-05-lal-gsw',
    date: '2026-05-05',
    time: '20:00',
    status: 'live',
    arena: 'Chase Center',
    city: 'San Francisco, CA',
    awayTeam: {
      id: 'lal',
      name: 'Lakers',
      abbreviation: 'LAL',
      city: 'Los Angeles',
      record: '50-32',
      score: 87,
    },
    homeTeam: {
      id: 'gsw',
      name: 'Warriors',
      abbreviation: 'GSW',
      city: 'Golden State',
      record: '48-34',
      score: 91,
    },
    period: 'Q3',
    clock: '04:18',
    notes: 'Live state demo',
  },
  {
    id: 'game-2026-05-05-mia-mil',
    date: '2026-05-05',
    time: '21:30',
    status: 'scheduled',
    arena: 'Fiserv Forum',
    city: 'Milwaukee, WI',
    awayTeam: {
      id: 'mia',
      name: 'Heat',
      abbreviation: 'MIA',
      city: 'Miami',
      record: '44-38',
    },
    homeTeam: {
      id: 'mil',
      name: 'Bucks',
      abbreviation: 'MIL',
      city: 'Milwaukee',
      record: '52-30',
    },
    notes: 'National TV window',
  },
  {
    id: 'game-2026-05-06-dal-okc',
    date: '2026-05-06',
    time: '19:00',
    status: 'scheduled',
    arena: 'Paycom Center',
    city: 'Oklahoma City, OK',
    awayTeam: {
      id: 'dal',
      name: 'Mavericks',
      abbreviation: 'DAL',
      city: 'Dallas',
      record: '47-35',
    },
    homeTeam: {
      id: 'okc',
      name: 'Thunder',
      abbreviation: 'OKC',
      city: 'Oklahoma City',
      record: '58-24',
    },
  },
  {
    id: 'game-2026-05-06-bos-den',
    date: '2026-05-06',
    time: '22:00',
    status: 'scheduled',
    arena: 'Ball Arena',
    city: 'Denver, CO',
    awayTeam: {
      id: 'bos',
      name: 'Celtics',
      abbreviation: 'BOS',
      city: 'Boston',
      record: '56-26',
    },
    homeTeam: {
      id: 'den',
      name: 'Nuggets',
      abbreviation: 'DEN',
      city: 'Denver',
      record: '53-29',
    },
    notes: 'Potential Finals preview',
  },
];

export function getMockGamesByDate(date: string): Game[] {
  return gamesMock
    .filter((game) => game.date === date)
    .sort((gameA, gameB) => gameA.time.localeCompare(gameB.time));
}
