import { pool } from '../db/pool.js';
import { logger } from '../utils/logger.js';

const API_BASKETBALL_BASE_URL =
  process.env.API_BASKETBALL_BASE_URL ?? 'https://v1.basketball.api-sports.io';
const API_BASKETBALL_KEY = process.env.API_BASKETBALL_KEY;
const API_BASKETBALL_NBA_LEAGUE_ID = process.env.API_BASKETBALL_NBA_LEAGUE_ID ?? '12';
const API_BASKETBALL_TIMEOUT_MS = Number(process.env.API_BASKETBALL_TIMEOUT_MS ?? 15000);
const API_BASKETBALL_STANDINGS_TTL_HOURS = Number(
  process.env.API_BASKETBALL_STANDINGS_TTL_HOURS ?? 24,
);

interface StandingsParams {
  season?: string;
  season_type?: string;
  forceRefresh?: boolean;
}

interface ApiSportsEnvelope {
  errors?: unknown[] | Record<string, unknown>;
  response?: unknown;
}

interface RealStanding {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamAbbreviation: string;
  conference: 'East' | 'West' | string;
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

export class ApiBasketballServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502, cause?: unknown) {
    super(message, { cause });
    this.name = 'ApiBasketballServiceError';
    this.statusCode = statusCode;
  }
}

const nbaTeamMeta: Record<string, { city: string; name: string; abbreviation: string; conference: 'East' | 'West'; division: string }> = {
  'atlanta hawks': { city: 'Atlanta', name: 'Hawks', abbreviation: 'ATL', conference: 'East', division: 'Southeast' },
  'boston celtics': { city: 'Boston', name: 'Celtics', abbreviation: 'BOS', conference: 'East', division: 'Atlantic' },
  'brooklyn nets': { city: 'Brooklyn', name: 'Nets', abbreviation: 'BKN', conference: 'East', division: 'Atlantic' },
  'charlotte hornets': { city: 'Charlotte', name: 'Hornets', abbreviation: 'CHA', conference: 'East', division: 'Southeast' },
  'chicago bulls': { city: 'Chicago', name: 'Bulls', abbreviation: 'CHI', conference: 'East', division: 'Central' },
  'cleveland cavaliers': { city: 'Cleveland', name: 'Cavaliers', abbreviation: 'CLE', conference: 'East', division: 'Central' },
  'dallas mavericks': { city: 'Dallas', name: 'Mavericks', abbreviation: 'DAL', conference: 'West', division: 'Southwest' },
  'denver nuggets': { city: 'Denver', name: 'Nuggets', abbreviation: 'DEN', conference: 'West', division: 'Northwest' },
  'detroit pistons': { city: 'Detroit', name: 'Pistons', abbreviation: 'DET', conference: 'East', division: 'Central' },
  'golden state warriors': { city: 'Golden State', name: 'Warriors', abbreviation: 'GSW', conference: 'West', division: 'Pacific' },
  'houston rockets': { city: 'Houston', name: 'Rockets', abbreviation: 'HOU', conference: 'West', division: 'Southwest' },
  'indiana pacers': { city: 'Indiana', name: 'Pacers', abbreviation: 'IND', conference: 'East', division: 'Central' },
  'la clippers': { city: 'LA', name: 'Clippers', abbreviation: 'LAC', conference: 'West', division: 'Pacific' },
  'los angeles clippers': { city: 'LA', name: 'Clippers', abbreviation: 'LAC', conference: 'West', division: 'Pacific' },
  'los angeles lakers': { city: 'Los Angeles', name: 'Lakers', abbreviation: 'LAL', conference: 'West', division: 'Pacific' },
  'memphis grizzlies': { city: 'Memphis', name: 'Grizzlies', abbreviation: 'MEM', conference: 'West', division: 'Southwest' },
  'miami heat': { city: 'Miami', name: 'Heat', abbreviation: 'MIA', conference: 'East', division: 'Southeast' },
  'milwaukee bucks': { city: 'Milwaukee', name: 'Bucks', abbreviation: 'MIL', conference: 'East', division: 'Central' },
  'minnesota timberwolves': { city: 'Minnesota', name: 'Timberwolves', abbreviation: 'MIN', conference: 'West', division: 'Northwest' },
  'new orleans pelicans': { city: 'New Orleans', name: 'Pelicans', abbreviation: 'NOP', conference: 'West', division: 'Southwest' },
  'new york knicks': { city: 'New York', name: 'Knicks', abbreviation: 'NYK', conference: 'East', division: 'Atlantic' },
  'oklahoma city thunder': { city: 'Oklahoma City', name: 'Thunder', abbreviation: 'OKC', conference: 'West', division: 'Northwest' },
  'orlando magic': { city: 'Orlando', name: 'Magic', abbreviation: 'ORL', conference: 'East', division: 'Southeast' },
  'philadelphia 76ers': { city: 'Philadelphia', name: '76ers', abbreviation: 'PHI', conference: 'East', division: 'Atlantic' },
  'phoenix suns': { city: 'Phoenix', name: 'Suns', abbreviation: 'PHX', conference: 'West', division: 'Pacific' },
  'portland trail blazers': { city: 'Portland', name: 'Trail Blazers', abbreviation: 'POR', conference: 'West', division: 'Northwest' },
  'sacramento kings': { city: 'Sacramento', name: 'Kings', abbreviation: 'SAC', conference: 'West', division: 'Pacific' },
  'san antonio spurs': { city: 'San Antonio', name: 'Spurs', abbreviation: 'SAS', conference: 'West', division: 'Southwest' },
  'toronto raptors': { city: 'Toronto', name: 'Raptors', abbreviation: 'TOR', conference: 'East', division: 'Atlantic' },
  'utah jazz': { city: 'Utah', name: 'Jazz', abbreviation: 'UTA', conference: 'West', division: 'Northwest' },
  'washington wizards': { city: 'Washington', name: 'Wizards', abbreviation: 'WAS', conference: 'East', division: 'Southeast' },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function getNestedNumber(source: Record<string, unknown>, path: string[], fallback = 0): number {
  let current: unknown = source;

  for (const key of path) {
    if (!isRecord(current)) {
      return fallback;
    }

    current = current[key];
  }

  return toNumber(current, fallback);
}

function normalizeSeason(season = '2025-26'): string {
  const shortSeasonMatch = /^(\d{4})-(\d{2})$/.exec(season);

  if (!shortSeasonMatch) {
    return season;
  }

  const startYear = Number(shortSeasonMatch[1]);
  const endYear = startYear + 1;

  return `${startYear}-${endYear}`;
}

function normalizeCacheSeason(season = '2025-26'): string {
  return season;
}

function flattenStandingsRows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.flatMap(flattenStandingsRows);
  }

  if (!isRecord(value)) {
    return [];
  }

  if (isRecord(value.team) && isRecord(value.games)) {
    return [value];
  }

  return Object.values(value).flatMap(flattenStandingsRows);
}

function getTeamMeta(fullName: string) {
  const key = fullName.trim().toLowerCase();
  const meta = nbaTeamMeta[key];

  if (meta) {
    return meta;
  }

  const nameParts = fullName.trim().split(/\s+/);
  const fallbackName = nameParts.pop() ?? fullName;

  return {
    city: nameParts.join(' ') || fullName,
    name: fallbackName,
    abbreviation: fallbackName.slice(0, 3).toUpperCase(),
    conference: 'East' as const,
    division: 'NBA',
  };
}

function getConference(row: Record<string, unknown>, meta: ReturnType<typeof getTeamMeta>) {
  const group = isRecord(row.group) ? row.group : undefined;
  const rawGroupName = typeof group?.name === 'string' ? group.name : '';
  const normalizedGroupName = rawGroupName.toLowerCase();

  if (normalizedGroupName.includes('west')) {
    return 'West';
  }

  if (normalizedGroupName.includes('east')) {
    return 'East';
  }

  return meta.conference;
}

function getRecord(row: Record<string, unknown>, venue: 'home' | 'away'): string {
  const wins = getNestedNumber(row, ['games', 'win', venue], Number.NaN);
  const losses = getNestedNumber(row, ['games', 'lose', venue], Number.NaN);

  if (Number.isFinite(wins) && Number.isFinite(losses)) {
    return `${wins}-${losses}`;
  }

  return '-';
}

function getLastTen(form: string): string {
  const lastTenGames = form.replace(/[^WL]/gi, '').toUpperCase().slice(-10);

  if (!lastTenGames) {
    return '-';
  }

  const wins = [...lastTenGames].filter((result) => result === 'W').length;

  return `${wins}-${lastTenGames.length - wins}`;
}

function getStreak(form: string): string {
  const cleanForm = form.replace(/[^WL]/gi, '').toUpperCase();
  const latestResult = cleanForm.at(-1);

  if (!latestResult) {
    return '-';
  }

  let count = 0;

  for (let index = cleanForm.length - 1; index >= 0; index -= 1) {
    if (cleanForm[index] !== latestResult) {
      break;
    }

    count += 1;
  }

  return `${latestResult}${count}`;
}

function normalizeStandings(response: unknown): RealStanding[] {
  const rows = flattenStandingsRows(response);

  if (rows.length === 0) {
    throw new ApiBasketballServiceError('API-Basketball returned an empty standings response', 404);
  }

  return rows
    .map((row) => {
      const team = isRecord(row.team) ? row.team : {};
      const teamName = typeof team.name === 'string' ? team.name : 'Unknown Team';
      const meta = getTeamMeta(teamName);
      const wins = getNestedNumber(row, ['games', 'win', 'total']);
      const losses = getNestedNumber(row, ['games', 'lose', 'total']);
      const form = typeof row.form === 'string' ? row.form : '';
      const conference = getConference(row, meta);
      const group = isRecord(row.group) ? row.group : undefined;
      const groupName = typeof group?.name === 'string' ? group.name : '';

      return {
        teamId: toNumber(team.id),
        teamName: meta.name,
        teamCity: meta.city,
        teamAbbreviation: meta.abbreviation,
        conference,
        division: groupName && !groupName.toLowerCase().includes('conference') ? groupName : meta.division,
        wins,
        losses,
        winPct: getNestedNumber(row, ['games', 'win', 'percentage'], wins + losses > 0 ? wins / (wins + losses) : 0),
        conferenceRank: toNumber(row.position),
        divisionRank: toNumber(row.position),
        homeRecord: getRecord(row, 'home'),
        awayRecord: getRecord(row, 'away'),
        lastTen: getLastTen(form),
        streak: getStreak(form),
      };
    })
    .filter((standing) => standing.teamId > 0 && standing.teamName !== 'Unknown Team')
    .sort((teamA, teamB) => {
      if (teamA.conference === teamB.conference) {
        return teamA.conferenceRank - teamB.conferenceRank;
      }

      return String(teamA.conference).localeCompare(String(teamB.conference));
    });
}

async function ensureStandingsCacheTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS standings_cache (
      id SERIAL PRIMARY KEY,
      provider TEXT NOT NULL DEFAULT 'api-basketball',
      league_id TEXT NOT NULL,
      season TEXT NOT NULL,
      season_type TEXT NOT NULL DEFAULT 'Regular Season',
      payload JSONB NOT NULL,
      fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider, league_id, season, season_type)
    );
  `);
}

async function getCachedStandings(
  season: string,
  seasonType: string,
  allowExpired: boolean,
): Promise<RealStanding[] | undefined> {
  await ensureStandingsCacheTable();

  const result = await pool.query<{ payload: RealStanding[] }>(
    `
      SELECT payload
      FROM standings_cache
      WHERE provider = 'api-basketball'
        AND league_id = $1
        AND season = $2
        AND season_type = $3
        AND ($4::boolean OR fetched_at >= NOW() - ($5::text || ' hours')::interval)
      ORDER BY fetched_at DESC
      LIMIT 1
    `,
    [
      API_BASKETBALL_NBA_LEAGUE_ID,
      season,
      seasonType,
      allowExpired,
      API_BASKETBALL_STANDINGS_TTL_HOURS,
    ],
  );

  return result.rows[0]?.payload;
}

async function saveStandingsCache(season: string, seasonType: string, standings: RealStanding[]) {
  await ensureStandingsCacheTable();

  await pool.query(
    `
      INSERT INTO standings_cache (provider, league_id, season, season_type, payload, fetched_at)
      VALUES ('api-basketball', $1, $2, $3, $4::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (provider, league_id, season, season_type)
      DO UPDATE SET payload = EXCLUDED.payload, fetched_at = CURRENT_TIMESTAMP
    `,
    [API_BASKETBALL_NBA_LEAGUE_ID, season, seasonType, JSON.stringify(standings)],
  );
}

async function fetchApiSportsStandings(season: string): Promise<RealStanding[]> {
  if (!API_BASKETBALL_KEY) {
    throw new ApiBasketballServiceError('API_BASKETBALL_KEY is not configured', 500);
  }

  const url = new URL('/standings', API_BASKETBALL_BASE_URL);
  url.searchParams.set('league', API_BASKETBALL_NBA_LEAGUE_ID);
  url.searchParams.set('season', normalizeSeason(season));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_BASKETBALL_TIMEOUT_MS);

  logger.info(`Calling API-Basketball service... ${url.pathname}${url.search}`);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'x-apisports-key': API_BASKETBALL_KEY,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      logger.error('API-Basketball service error', response.status, detail);

      throw new ApiBasketballServiceError(
        `API-Basketball responded with status ${response.status}`,
        response.status >= 500 ? 502 : response.status,
      );
    }

    const envelope = (await response.json()) as ApiSportsEnvelope;

    if (Array.isArray(envelope.errors) && envelope.errors.length > 0) {
      logger.error('API-Basketball service error', envelope.errors);
      throw new ApiBasketballServiceError('API-Basketball returned an error response', 502);
    }

    if (isRecord(envelope.errors) && Object.keys(envelope.errors).length > 0) {
      logger.error('API-Basketball service error', envelope.errors);
      throw new ApiBasketballServiceError('API-Basketball returned an error response', 502);
    }

    const standings = normalizeStandings(envelope.response);

    logger.info('API-Basketball service response OK');

    return standings;
  } catch (error) {
    if (error instanceof ApiBasketballServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('API-Basketball service error', 'Request timed out');
      throw new ApiBasketballServiceError('API-Basketball request timed out', 504, error);
    }

    logger.error('API-Basketball service error', error);
    throw new ApiBasketballServiceError('API-Basketball service is unavailable', 502, error);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getApiBasketballStandings(params: StandingsParams = {}) {
  const season = normalizeCacheSeason(params.season);
  const seasonType = params.season_type ?? 'Regular Season';

  if (!params.forceRefresh) {
    const cachedStandings = await getCachedStandings(season, seasonType, false);

    if (cachedStandings) {
      logger.info('API-Basketball standings cache hit');
      return cachedStandings;
    }
  }

  try {
    const standings = await fetchApiSportsStandings(season);
    await saveStandingsCache(season, seasonType, standings);

    return standings;
  } catch (error) {
    const expiredCache = await getCachedStandings(season, seasonType, true);

    if (expiredCache) {
      logger.warn('API-Basketball failed; returning expired standings cache');
      return expiredCache;
    }

    throw error;
  }
}
