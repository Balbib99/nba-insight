export interface SeasonChampion {
  season: string;
  champion: string;
  runnerUp: string;
  finalsResult: string;
  finalsMvp: string;
  note: string;
}

export const seasonChampions: SeasonChampion[] = [
  {
    season: '2024-25',
    champion: 'Oklahoma City Thunder',
    runnerUp: 'Indiana Pacers',
    finalsResult: '4-3',
    finalsMvp: 'Shai Gilgeous-Alexander',
    note: 'Thunder won Game 7 to close a seven-game NBA Finals.',
  },
  {
    season: '2023-24',
    champion: 'Boston Celtics',
    runnerUp: 'Dallas Mavericks',
    finalsResult: '4-1',
    finalsMvp: 'Jaylen Brown',
    note: 'Celtics won their 18th championship.',
  },
];
