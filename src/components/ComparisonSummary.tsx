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
    <article className="border border-rule bg-ink-900 p-5">
      <p className="font-body text-sm text-text-secondary">Comparison summary</p>
      <div className="mt-4 divide-y divide-rule border-t border-rule">
        {[scoring, playmaking, efficiency].map((summary) => (
          <p key={summary} className="py-3 text-sm leading-6 text-text-secondary first:pt-4">
            {summary}
          </p>
        ))}
      </div>
    </article>
  );
}
