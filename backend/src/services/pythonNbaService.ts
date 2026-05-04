const PYTHON_NBA_SERVICE_URL =
  process.env.PYTHON_NBA_SERVICE_URL ?? 'http://localhost:8000';
const PYTHON_NBA_SERVICE_TIMEOUT_MS = Number(
  process.env.PYTHON_NBA_SERVICE_TIMEOUT_MS ?? 10000,
);

export interface RealNbaQueryParams {
  season?: string;
  stat?: string;
  season_type?: string;
}

export class PythonNbaServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502, cause?: unknown) {
    super(message, { cause });
    this.name = 'PythonNbaServiceError';
    this.statusCode = statusCode;
  }
}

function buildUrl(path: string, params?: Record<string, string | undefined>): URL {
  const url = new URL(path, PYTHON_NBA_SERVICE_URL);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function fetchPythonService<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  const url = buildUrl(path, params);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PYTHON_NBA_SERVICE_TIMEOUT_MS);

  console.log(`Calling Python NBA service... ${url.pathname}${url.search}`);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Python service error', response.status, detail);

      throw new PythonNbaServiceError(
        `Python NBA service responded with status ${response.status}`,
        response.status >= 500 ? 502 : response.status,
      );
    }

    const data = (await response.json()) as T;

    if (Array.isArray(data) && data.length === 0) {
      throw new PythonNbaServiceError('Python NBA service returned an empty response', 404);
    }

    if (!data) {
      throw new PythonNbaServiceError('Python NBA service returned no data', 404);
    }

    console.log('Python service response OK');

    return data;
  } catch (error) {
    if (error instanceof PythonNbaServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Python service error', 'Request timed out');
      throw new PythonNbaServiceError('Python NBA service request timed out', 504, error);
    }

    console.error('Python service error', error);
    throw new PythonNbaServiceError('Python NBA service is unavailable', 502, error);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPythonServiceHealth() {
  return fetchPythonService('/health');
}

export async function getLeagueLeaders(params: RealNbaQueryParams) {
  return fetchPythonService('/league-leaders', {
    season: params.season,
    stat: params.stat,
    season_type: params.season_type,
  });
}

export async function getPlayerGameLog(playerId: string, params: RealNbaQueryParams) {
  return fetchPythonService(`/player-gamelog/${encodeURIComponent(playerId)}`, {
    season: params.season,
    season_type: params.season_type,
  });
}

export async function getTeamDetails(teamId: string) {
  return fetchPythonService(`/team-details/${encodeURIComponent(teamId)}`);
}
