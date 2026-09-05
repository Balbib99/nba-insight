import { HeatLegend } from './HeatLegend';
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

function getNumericValue(player: PlayerStats, key: StatsTableColumn['key']): number {
  if (key === 'points') {
    return player.pointsPerGame;
  }

  if (key === 'rebounds') {
    return player.reboundsPerGame;
  }

  if (key === 'assists') {
    return player.assistsPerGame;
  }

  if (key === 'efficiency') {
    return calculatePlayerEfficiency(player);
  }

  if (key === 'minutes') {
    return player.minutesPerGame;
  }

  return player.fieldGoalPct;
}

function getColumnDisplay(player: PlayerStats, key: StatsTableColumn['key']): string {
  if (key === 'shooting') {
    return `${formatStat(player.fieldGoalPct)}% / ${formatStat(player.threePointPct)}%`;
  }

  return formatStat(getNumericValue(player, key));
}

function getColumnStats(players: PlayerStats[], key: StatsTableColumn['key']) {
  const values = players.map((player) => getNumericValue(player, key));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return { mean, spread: Math.sqrt(variance), max: Math.max(...values) };
}

function getHeatClass(value: number, mean: number, spread: number): string {
  if (spread === 0) {
    return '';
  }

  const deviation = (value - mean) / spread;

  if (deviation > 0.4) {
    return 'bg-score-orange/10';
  }

  if (deviation < -0.4) {
    return 'bg-live-cyan/10';
  }

  return '';
}

export function StatsTable({ title, players, columns }: StatsTableProps) {
  const columnStats = columns.map((column) => getColumnStats(players, column.key));
  const showsLeaders = players.length > 1;

  return (
    <div className="border border-rule bg-ink-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-5 py-4">
        <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
        {showsLeaders ? <HeatLegend /> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-rule text-left text-sm">
          <thead className="text-xs text-text-secondary">
            <tr>
              <th scope="col" className="w-12 px-5 py-3 font-medium">#</th>
              <th scope="col" className="min-w-56 px-5 py-3 font-medium">Player</th>
              <th scope="col" className="min-w-48 px-5 py-3 font-medium">Team</th>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="whitespace-nowrap px-5 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {players.map((player, index) => (
              <tr key={player.playerId} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-4 font-display text-text-secondary">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="font-medium text-text-primary">{player.playerName}</div>
                  <div className="mt-1 text-xs text-text-secondary">{player.gamesPlayed} GP</div>
                </td>
                <td className="px-5 py-4 text-text-secondary">{player.teamName}</td>
                {columns.map((column, columnIndex) => {
                  const numericValue = getNumericValue(player, column.key);
                  const { mean, spread, max } = columnStats[columnIndex];
                  const isLeader = showsLeaders && numericValue === max;

                  return (
                    <td
                      key={column.key}
                      className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(
                        numericValue,
                        mean,
                        spread,
                      )}`}
                    >
                      {getColumnDisplay(player, column.key)}
                      {isLeader ? (
                        <span className="ml-1 text-score-orange" aria-label="Category leader">
                          *
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showsLeaders ? (
        <p className="border-t border-rule px-5 py-3 text-xs text-text-secondary">* Category leader in this list.</p>
      ) : null}
    </div>
  );
}
