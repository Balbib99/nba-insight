import { API_BASE_URL } from '../config/api';

const demoFavoritesKey = 'nba_insight_demo_favorites';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function requestBackendFavorites(
  token: string,
  endpoint: string,
  options: Omit<RequestInit, 'headers'> = {},
): Promise<string[]> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  } catch (error) {
    throw new Error('Could not reach the NBA Insight API. Please try again.', { cause: error });
  }

  const json = await readJson(response);

  if (!response.ok) {
    throw new Error('Favorites could not be synced with your account.');
  }

  if (!isStringArray(json)) {
    throw new Error('The NBA Insight API returned an unexpected favorites response.');
  }

  return json;
}

function readDemoFavorites(): string[] {
  const storedFavorites = window.localStorage.getItem(demoFavoritesKey);

  if (!storedFavorites) {
    return [];
  }

  try {
    const parsedFavorites = JSON.parse(storedFavorites) as unknown;

    return isStringArray(parsedFavorites) ? parsedFavorites : [];
  } catch {
    return [];
  }
}

function writeDemoFavorites(playerIds: string[]): string[] {
  window.localStorage.setItem(demoFavoritesKey, JSON.stringify(playerIds));

  return playerIds;
}

export function getBackendFavorites(token: string): Promise<string[]> {
  return requestBackendFavorites(token, '/api/favorites');
}

export function addBackendFavorite(token: string, playerId: string): Promise<string[]> {
  return requestBackendFavorites(token, '/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  });
}

export function removeBackendFavorite(token: string, playerId: string): Promise<string[]> {
  return requestBackendFavorites(token, `/api/favorites/${encodeURIComponent(playerId)}`, {
    method: 'DELETE',
  });
}

export function getDemoFavorites(): string[] {
  return readDemoFavorites();
}

export function addDemoFavorite(playerId: string): string[] {
  const currentFavorites = readDemoFavorites();
  const nextFavorites = currentFavorites.includes(playerId) ? currentFavorites : [...currentFavorites, playerId];

  return writeDemoFavorites(nextFavorites);
}

export function removeDemoFavorite(playerId: string): string[] {
  return writeDemoFavorites(readDemoFavorites().filter((favoritePlayerId) => favoritePlayerId !== playerId));
}
