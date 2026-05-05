import { mockTeamStats } from '../data/mockTeamStats';
import { API_BASE_URL } from '../config/api';
import { getMockGamesByDate, type Game } from '../data/gamesMock';
import { mockPlayers } from '../data/mockPlayers';
import { mockStats } from '../data/mockStats';
import { getMockStandings } from '../data/standingsMock';
import { teams } from '../data/teams';
import { fetchWithFallback } from './dataMode';
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

type RealLeaderStat = 'PTS' | 'REB' | 'AST' | 'STL' | 'BLK' | 'FG_PCT' | 'FG3_PCT' | 'FT_PCT';

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
  return fetchWithFallback<Team[]>({
    apiCall: () => fetchFromApi<Team[]>('/api/teams'),
    fallback: () => teams,
    context: 'Teams directory',
  });
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  return fetchWithFallback<Team | undefined>({
    apiCall: () => fetchOptionalFromApi<Team>(`/api/teams/${id}`),
    fallback: () => teams.find((team) => team.id === id),
    context: `Team detail ${id}`,
  });
}

export async function getPlayers(): Promise<Player[]> {
  return fetchWithFallback<Player[]>({
    apiCall: () => fetchFromApi<Player[]>('/api/players'),
    fallback: () => mockPlayers,
    context: 'Players directory',
  });
}

export async function getPlayersByTeamId(teamId: string): Promise<Player[]> {
  const players = await getPlayers();

  return players.filter((player) => player.teamId === teamId);
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  return fetchWithFallback<Player | undefined>({
    apiCall: () => fetchOptionalFromApi<Player>(`/api/players/${id}`),
    fallback: () => mockPlayers.find((player) => player.id === id),
    context: `Player detail ${id}`,
  });
}

export async function getPlayerStats(): Promise<PlayerStats[]> {
  return fetchWithFallback<PlayerStats[]>({
    apiCall: () => fetchFromApi<PlayerStats[]>('/api/stats/players'),
    fallback: () => mockStats,
    context: 'Player statistics',
  });
}

export async function getStatsByPlayerId(id: string): Promise<PlayerStats | undefined> {
  return fetchWithFallback<PlayerStats | undefined>({
    apiCall: () => fetchOptionalFromApi<PlayerStats>(`/api/stats/players/${id}`),
    fallback: () => mockStats.find((playerStats) => playerStats.playerId === id),
    context: `Player statistics ${id}`,
  });
}

function getTeamAbbreviation(teamName: string): string {
  return teams.find((team) => team.fullName === teamName)?.abbreviation ?? 'NBA';
}

function statValue(playerStats: PlayerStats, stat: RealLeaderStat): number {
  switch (stat) {
    case 'REB':
      return playerStats.reboundsPerGame;
    case 'AST':
      return playerStats.assistsPerGame;
    case 'STL':
      return playerStats.stealsPerGame;
    case 'BLK':
      return playerStats.blocksPerGame;
    case 'FG_PCT':
      return playerStats.fieldGoalPct;
    case 'FG3_PCT':
      return playerStats.threePointPct;
    case 'FT_PCT':
      return playerStats.freeThrowPct;
    case 'PTS':
    default:
      return playerStats.pointsPerGame;
  }
}

function getMockRealLeagueLeaders(stat = 'PTS'): RealLeagueLeader[] {
  const normalizedStat: RealLeaderStat =
    stat === 'REB' ||
    stat === 'AST' ||
    stat === 'STL' ||
    stat === 'BLK' ||
    stat === 'FG_PCT' ||
    stat === 'FG3_PCT' ||
    stat === 'FT_PCT'
      ? stat
      : 'PTS';

  return [...mockStats]
    .sort((playerA, playerB) => statValue(playerB, normalizedStat) - statValue(playerA, normalizedStat))
    .slice(0, 20)
    .map((playerStats, index) => ({
      playerId: index + 1,
      playerName: playerStats.playerName,
      teamId: index + 1,
      teamAbbreviation: getTeamAbbreviation(playerStats.teamName),
      gamesPlayed: playerStats.gamesPlayed,
      minutes: playerStats.minutesPerGame,
      points: playerStats.pointsPerGame,
      rebounds: playerStats.reboundsPerGame,
      assists: playerStats.assistsPerGame,
      steals: playerStats.stealsPerGame,
      blocks: playerStats.blocksPerGame,
      fieldGoalPct: playerStats.fieldGoalPct / 100,
      threePointPct: playerStats.threePointPct / 100,
      freeThrowPct: playerStats.freeThrowPct / 100,
    }));
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

  return fetchWithFallback<RealLeagueLeader[]>({
    apiCall: () =>
      fetchFromApi<RealLeagueLeader[]>(`/api/real/league-leaders${queryString ? `?${queryString}` : ''}`),
    fallback: () => getMockRealLeagueLeaders(params.stat),
    context: 'Real league leaders',
  });
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

  return fetchWithFallback<RealStanding[]>({
    apiCall: () => fetchFromApi<RealStanding[]>(`/api/standings${queryString ? `?${queryString}` : ''}`),
    fallback: () => getMockStandings(),
    context: 'NBA standings',
  });
}

export async function getGamesByDate(date: string): Promise<Game[]> {
  // Temporary local mock source. Future phase:
  // apiCall: () => fetchFromApi<Game[]>(`/api/games?date=${encodeURIComponent(date)}`)
  return fetchWithFallback<Game[]>({
    apiCall: () => fetchFromApi<Game[]>(`/api/games?date=${encodeURIComponent(date)}`),
    fallback: () => getMockGamesByDate(date),
    context: `Games for ${date}`,
  });
}

export async function getFavorites(userId: string): Promise<string[]> {
  return fetchWithFallback<string[]>({
    apiCall: () => fetchFromApi<string[]>(`/api/favorites/${userId}`),
    fallback: () => JSON.parse(window.localStorage.getItem(`nba-insight:favorites:${userId}`) ?? '[]') as string[],
    context: `Favorites ${userId}`,
  });
}

export async function addFavorite(userId: string, playerId: string): Promise<string[]> {
  return fetchWithFallback<string[]>({
    apiCall: () =>
      fetchFromApi<string[]>(`/api/favorites/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      }),
    fallback: () => {
      const storageKey = `nba-insight:favorites:${userId}`;
      const currentFavorites = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as string[];
      const nextFavorites = currentFavorites.includes(playerId) ? currentFavorites : [...currentFavorites, playerId];
      window.localStorage.setItem(storageKey, JSON.stringify(nextFavorites));

      return nextFavorites;
    },
    context: `Add favorite ${playerId}`,
  });
}

export async function removeFavorite(userId: string, playerId: string): Promise<string[]> {
  return fetchWithFallback<string[]>({
    apiCall: () =>
      fetchFromApi<string[]>(`/api/favorites/${userId}/${playerId}`, {
        method: 'DELETE',
      }),
    fallback: () => {
      const storageKey = `nba-insight:favorites:${userId}`;
      const currentFavorites = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as string[];
      const nextFavorites = currentFavorites.filter((favoritePlayerId) => favoritePlayerId !== playerId);
      window.localStorage.setItem(storageKey, JSON.stringify(nextFavorites));

      return nextFavorites;
    },
    context: `Remove favorite ${playerId}`,
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
