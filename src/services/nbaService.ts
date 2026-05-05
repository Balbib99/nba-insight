import { mockTeamStats } from '../data/mockTeamStats';
import { API_BASE_URL } from '../config/api';
import { getMockGamesByDate, type Game } from '../data/gamesMock';
import type { Player } from '../types/player';
import type { PlayerStats } from '../types/playerStats';
import type { RealLeagueLeader } from '../types/realLeagueLeader';
import type { RealStanding } from '../types/realStanding';
import type { Team } from '../types/team';
import type { TeamStats } from '../types/teamStats';

export interface RealLeagueLeadersParams {
  season?: string;
  stat?: string;
  season_type?: string;
}

export interface RealStandingsParams {
  season?: string;
  season_type?: string;
}

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';

    throw new Error(`NBA Insight API request failed for ${endpoint}: ${message}`, { cause: error });
  }
}

async function fetchOptionalFromApi<T>(endpoint: string): Promise<T | undefined> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';

    throw new Error(`NBA Insight API request failed for ${endpoint}: ${message}`, { cause: error });
  }
}

export function calculatePlayerEfficiency(player: PlayerStats): number {
  return (
    player.pointsPerGame +
    player.reboundsPerGame +
    player.assistsPerGame -
    player.turnoversPerGame
  );
}

export async function getTeams(): Promise<Team[]> {
  return fetchFromApi<Team[]>('/api/teams');
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  return fetchOptionalFromApi<Team>(`/api/teams/${id}`);
}

export async function getPlayers(): Promise<Player[]> {
  return fetchFromApi<Player[]>('/api/players');
}

export async function getPlayersByTeamId(teamId: string): Promise<Player[]> {
  const players = await getPlayers();

  return players.filter((player) => player.teamId === teamId);
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  return fetchOptionalFromApi<Player>(`/api/players/${id}`);
}

export async function getPlayerStats(): Promise<PlayerStats[]> {
  return fetchFromApi<PlayerStats[]>('/api/stats/players');
}

export async function getStatsByPlayerId(id: string): Promise<PlayerStats | undefined> {
  return fetchOptionalFromApi<PlayerStats>(`/api/stats/players/${id}`);
}

export async function getRealLeagueLeaders(
  params: RealLeagueLeadersParams = {},
): Promise<RealLeagueLeader[]> {
  const searchParams = new URLSearchParams();

  if (params.season) {
    searchParams.set('season', params.season);
  }

  if (params.stat) {
    searchParams.set('stat', params.stat);
  }

  if (params.season_type) {
    searchParams.set('season_type', params.season_type);
  }

  const queryString = searchParams.toString();

  return fetchFromApi<RealLeagueLeader[]>(
    `/api/real/league-leaders${queryString ? `?${queryString}` : ''}`,
  );
}

export async function getRealStandings(params: RealStandingsParams = {}): Promise<RealStanding[]> {
  const searchParams = new URLSearchParams();

  if (params.season) {
    searchParams.set('season', params.season);
  }

  if (params.season_type) {
    searchParams.set('season_type', params.season_type);
  }

  const queryString = searchParams.toString();

  return fetchFromApi<RealStanding[]>(`/api/standings${queryString ? `?${queryString}` : ''}`);
}

export async function getGamesByDate(date: string): Promise<Game[]> {
  // Temporary local mock source. Future phase:
  // return fetchFromApi<Game[]>(`/api/games?date=${encodeURIComponent(date)}`);
  return Promise.resolve(getMockGamesByDate(date));
}

export async function getFavorites(userId: string): Promise<string[]> {
  return fetchFromApi<string[]>(`/api/favorites/${userId}`);
}

export async function addFavorite(userId: string, playerId: string): Promise<string[]> {
  return fetchFromApi<string[]>(`/api/favorites/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerId }),
  });
}

export async function removeFavorite(userId: string, playerId: string): Promise<string[]> {
  return fetchFromApi<string[]>(`/api/favorites/${userId}/${playerId}`, {
    method: 'DELETE',
  });
}

export async function getTeamStatsById(teamId: string): Promise<TeamStats | undefined> {
  return Promise.resolve(mockTeamStats.find((teamStats) => teamStats.teamId === teamId));
}

export async function getTopScorers(limit = 10): Promise<PlayerStats[]> {
  const playerStats = await getPlayerStats();

  return [...playerStats]
    .sort((playerA, playerB) => playerB.pointsPerGame - playerA.pointsPerGame)
    .slice(0, limit);
}

export async function getTopAssistPlayers(limit = 10): Promise<PlayerStats[]> {
  const playerStats = await getPlayerStats();

  return [...playerStats]
    .sort((playerA, playerB) => playerB.assistsPerGame - playerA.assistsPerGame)
    .slice(0, limit);
}

export async function getMostEfficientPlayers(limit = 10): Promise<PlayerStats[]> {
  const playerStats = await getPlayerStats();

  return [...playerStats]
    .sort((playerA, playerB) => calculatePlayerEfficiency(playerB) - calculatePlayerEfficiency(playerA))
    .slice(0, limit);
}
