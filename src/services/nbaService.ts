import { mockPlayers } from '../data/mockPlayers';
import { mockStats } from '../data/mockStats';
import { mockTeamStats } from '../data/mockTeamStats';
import { teams } from '../data/teams';
import type { Player } from '../types/player';
import type { PlayerStats } from '../types/playerStats';
import type { Team } from '../types/team';
import type { TeamStats } from '../types/teamStats';

export function calculatePlayerEfficiency(player: PlayerStats): number {
  return (
    player.pointsPerGame +
    player.reboundsPerGame +
    player.assistsPerGame -
    player.turnoversPerGame
  );
}

export async function getTeams(): Promise<Team[]> {
  return Promise.resolve(teams);
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  return Promise.resolve(teams.find((team) => team.id === id));
}

export async function getPlayers(): Promise<Player[]> {
  return Promise.resolve(mockPlayers);
}

export async function getPlayersByTeamId(teamId: string): Promise<Player[]> {
  return Promise.resolve(mockPlayers.filter((player) => player.teamId === teamId));
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  return Promise.resolve(mockPlayers.find((player) => player.id === id));
}

export async function getPlayerStats(): Promise<PlayerStats[]> {
  return Promise.resolve(mockStats);
}

export async function getStatsByPlayerId(id: string): Promise<PlayerStats | undefined> {
  return Promise.resolve(mockStats.find((playerStats) => playerStats.playerId === id));
}

export async function getTeamStatsById(teamId: string): Promise<TeamStats | undefined> {
  return Promise.resolve(mockTeamStats.find((teamStats) => teamStats.teamId === teamId));
}

export async function getTopScorers(limit = 10): Promise<PlayerStats[]> {
  return Promise.resolve(
    [...mockStats].sort((playerA, playerB) => playerB.pointsPerGame - playerA.pointsPerGame).slice(0, limit),
  );
}

export async function getTopAssistPlayers(limit = 10): Promise<PlayerStats[]> {
  return Promise.resolve(
    [...mockStats].sort((playerA, playerB) => playerB.assistsPerGame - playerA.assistsPerGame).slice(0, limit),
  );
}

export async function getMostEfficientPlayers(limit = 10): Promise<PlayerStats[]> {
  return Promise.resolve(
    [...mockStats]
      .sort((playerA, playerB) => calculatePlayerEfficiency(playerB) - calculatePlayerEfficiency(playerA))
      .slice(0, limit),
  );
}
