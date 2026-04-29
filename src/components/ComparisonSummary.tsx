import { Sparkles } from 'lucide-react';
import type { Player } from '../types/player';
import type { PlayerStats } from '../types/playerStats';

interface ComparisonSummaryProps {
  playerA: Player;
  playerB: Player;
  playerAStats: PlayerStats;
  playerBStats: PlayerStats;
}

function describeGap(valueA: number, valueB: number, playerAName: string, playerBName: string, label: string) {
  const gap = Math.abs(valueA - valueB);

  if (gap < 0.8) {
    return `Both players are similarly strong in ${label}.`;
  }

  return valueA > valueB
    ? `${playerAName} has the edge in ${label}.`
    : `${playerBName} has the edge in ${label}.`;
}

export function ComparisonSummary({ playerA, playerB, playerAStats, playerBStats }: ComparisonSummaryProps) {
  const scoring =
    playerAStats.pointsPerGame > playerBStats.pointsPerGame
      ? `${playerA.fullName} is the better scorer.`
      : playerBStats.pointsPerGame > playerAStats.pointsPerGame
        ? `${playerB.fullName} is the better scorer.`
        : 'Both players score at nearly the same level.';

  const playmaking =
    playerAStats.assistsPerGame > playerBStats.assistsPerGame
      ? `${playerA.fullName} contributes more as a playmaker.`
      : playerBStats.assistsPerGame > playerAStats.assistsPerGame
        ? `${playerB.fullName} contributes more as a playmaker.`
        : 'Both players create for teammates at a similar rate.';

  const efficiency = describeGap(
    playerAStats.fieldGoalPct + playerAStats.threePointPct,
    playerBStats.fieldGoalPct + playerBStats.threePointPct,
    playerA.fullName,
    playerB.fullName,
    'shooting efficiency',
  );

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
      <div className="flex items-center gap-2 text-sm font-medium text-red-300">
        <Sparkles className="size-4" aria-hidden="true" />
        Comparison Summary
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {[scoring, playmaking, efficiency].map((summary) => (
          <div key={summary} className="rounded-lg bg-white/[0.04] p-4 text-sm leading-6 text-zinc-300">
            {summary}
          </div>
        ))}
      </div>
    </article>
  );
}
