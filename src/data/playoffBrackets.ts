export interface PlayoffSeries {
  round: 'First Round' | 'Conference Semifinals' | 'Conference Finals' | 'NBA Finals';
  conference: 'East' | 'West' | 'NBA Finals';
  winner: string;
  loser: string;
  result: string;
}

export interface PlayoffBracket {
  season: string;
  series: PlayoffSeries[];
}

export const playoffBrackets: PlayoffBracket[] = [
  {
    season: '2024-25',
    series: [
      { round: 'First Round', conference: 'East', winner: 'Cleveland Cavaliers', loser: 'Miami Heat', result: '4-0' },
      { round: 'First Round', conference: 'East', winner: 'Boston Celtics', loser: 'Orlando Magic', result: '4-1' },
      { round: 'First Round', conference: 'East', winner: 'New York Knicks', loser: 'Detroit Pistons', result: '4-2' },
      { round: 'First Round', conference: 'East', winner: 'Indiana Pacers', loser: 'Milwaukee Bucks', result: '4-1' },
      { round: 'Conference Semifinals', conference: 'East', winner: 'Indiana Pacers', loser: 'Cleveland Cavaliers', result: '4-1' },
      { round: 'Conference Semifinals', conference: 'East', winner: 'New York Knicks', loser: 'Boston Celtics', result: '4-2' },
      { round: 'Conference Finals', conference: 'East', winner: 'Indiana Pacers', loser: 'New York Knicks', result: '4-2' },
      { round: 'First Round', conference: 'West', winner: 'Oklahoma City Thunder', loser: 'Memphis Grizzlies', result: '4-0' },
      { round: 'First Round', conference: 'West', winner: 'Denver Nuggets', loser: 'LA Clippers', result: '4-3' },
      { round: 'First Round', conference: 'West', winner: 'Minnesota Timberwolves', loser: 'Los Angeles Lakers', result: '4-1' },
      { round: 'First Round', conference: 'West', winner: 'Golden State Warriors', loser: 'Houston Rockets', result: '4-3' },
      { round: 'Conference Semifinals', conference: 'West', winner: 'Oklahoma City Thunder', loser: 'Denver Nuggets', result: '4-3' },
      { round: 'Conference Semifinals', conference: 'West', winner: 'Minnesota Timberwolves', loser: 'Golden State Warriors', result: '4-1' },
      { round: 'Conference Finals', conference: 'West', winner: 'Oklahoma City Thunder', loser: 'Minnesota Timberwolves', result: '4-1' },
      { round: 'NBA Finals', conference: 'NBA Finals', winner: 'Oklahoma City Thunder', loser: 'Indiana Pacers', result: '4-3' },
    ],
  },
  {
    season: '2023-24',
    series: [
      { round: 'First Round', conference: 'East', winner: 'Boston Celtics', loser: 'Miami Heat', result: '4-1' },
      { round: 'First Round', conference: 'East', winner: 'Cleveland Cavaliers', loser: 'Orlando Magic', result: '4-3' },
      { round: 'First Round', conference: 'East', winner: 'New York Knicks', loser: 'Philadelphia 76ers', result: '4-2' },
      { round: 'First Round', conference: 'East', winner: 'Indiana Pacers', loser: 'Milwaukee Bucks', result: '4-2' },
      { round: 'Conference Semifinals', conference: 'East', winner: 'Boston Celtics', loser: 'Cleveland Cavaliers', result: '4-1' },
      { round: 'Conference Semifinals', conference: 'East', winner: 'Indiana Pacers', loser: 'New York Knicks', result: '4-3' },
      { round: 'Conference Finals', conference: 'East', winner: 'Boston Celtics', loser: 'Indiana Pacers', result: '4-0' },
      { round: 'First Round', conference: 'West', winner: 'Oklahoma City Thunder', loser: 'New Orleans Pelicans', result: '4-0' },
      { round: 'First Round', conference: 'West', winner: 'Dallas Mavericks', loser: 'LA Clippers', result: '4-2' },
      { round: 'First Round', conference: 'West', winner: 'Minnesota Timberwolves', loser: 'Phoenix Suns', result: '4-0' },
      { round: 'First Round', conference: 'West', winner: 'Denver Nuggets', loser: 'Los Angeles Lakers', result: '4-1' },
      { round: 'Conference Semifinals', conference: 'West', winner: 'Dallas Mavericks', loser: 'Oklahoma City Thunder', result: '4-2' },
      { round: 'Conference Semifinals', conference: 'West', winner: 'Minnesota Timberwolves', loser: 'Denver Nuggets', result: '4-3' },
      { round: 'Conference Finals', conference: 'West', winner: 'Dallas Mavericks', loser: 'Minnesota Timberwolves', result: '4-1' },
      { round: 'NBA Finals', conference: 'NBA Finals', winner: 'Boston Celtics', loser: 'Dallas Mavericks', result: '4-1' },
    ],
  },
];
