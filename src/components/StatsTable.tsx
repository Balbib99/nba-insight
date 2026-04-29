import { calculatePlayerEfficiency } from '../services/nbaService';
import type { PlayerStats } from '../types/playerStats';

export interface StatsTableColumn {
  key: 'points' | 'rebounds' | 'assists' | 'efficiency' | 'minutes' | 'shooting';
  label: string;
}

interface StatsTableProps {
  title: string;
  players: PlayerStats[];
  columns: StatsTableColumn[];
}

function formatStat(value: number): string {
  return value.toFixed(1);
}

function getColumnValue(player: PlayerStats, key: StatsTableColumn['key']) {
  if (key === 'points') {
    return formatStat(player.pointsPerGame);
  }

  if (key === 'rebounds') {
    return formatStat(player.reboundsPerGame);
  }

  if (key === 'assists') {
    return formatStat(player.assistsPerGame);
  }

  if (key === 'efficiency') {
    return formatStat(calculatePlayerEfficiency(player));
  }

  if (key === 'minutes') {
    return formatStat(player.minutesPerGame);
  }

  return `${formatStat(player.fieldGoalPct)}% / ${formatStat(player.threePointPct)}%`;
}

export function StatsTable({ title, players, columns }: StatsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase text-zinc-500">
            <tr>
              <th className="w-12 px-5 py-3 font-semibold">#</th>
              <th className="min-w-56 px-5 py-3 font-semibold">Player</th>
              <th className="min-w-48 px-5 py-3 font-semibold">Team</th>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-5 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {players.map((player, index) => (
              <tr key={player.playerId} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-4 font-semibold text-zinc-500">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-white">{player.playerName}</div>
                  <div className="mt-1 text-xs text-zinc-500">{player.gamesPlayed} GP</div>
                </td>
                <td className="px-5 py-4 text-zinc-300">{player.teamName}</td>
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-5 py-4 font-medium text-zinc-100">
                    {getColumnValue(player, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
