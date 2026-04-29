import { AlertCircle, Brain, Clock3, Flame, Gauge, Loader2, Target, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { InsightCard } from '../components/InsightCard';
import { SectionTitle } from '../components/SectionTitle';
import { StatsTable } from '../components/StatsTable';
import {
  calculatePlayerEfficiency,
  getMostEfficientPlayers,
  getPlayerStats,
  getTopAssistPlayers,
  getTopScorers,
} from '../services/nbaService';
import type { PlayerStats } from '../types/playerStats';

interface AnalyticsData {
  allStats: PlayerStats[];
  topScorers: PlayerStats[];
  topPlaymakers: PlayerStats[];
  mostEfficient: PlayerStats[];
}

function formatStat(value: number): string {
  return value.toFixed(1);
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    allStats: [],
    topScorers: [],
    topPlaymakers: [],
    mostEfficient: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const [allStats, topScorers, topPlaymakers, mostEfficient] = await Promise.all([
          getPlayerStats(),
          getTopScorers(),
          getTopAssistPlayers(),
          getMostEfficientPlayers(),
        ]);

        if (isMounted) {
          setData({ allStats, topScorers, topPlaymakers, mostEfficient });
        }
      } catch {
        if (isMounted) {
          setError('Analytics data could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const insights = useMemo(() => {
    const topTenScorers = data.topScorers.slice(0, 10);
    const averageTopTenPoints =
      topTenScorers.length > 0
        ? topTenScorers.reduce((total, player) => total + player.pointsPerGame, 0) / topTenScorers.length
        : 0;

    const bestThreePointShooter = [...data.allStats].sort(
      (playerA, playerB) => playerB.threePointPct - playerA.threePointPct,
    )[0];

    const mostCompletePlayer = data.mostEfficient[0];
    const minutesLeader = [...data.allStats].sort(
      (playerA, playerB) => playerB.minutesPerGame - playerA.minutesPerGame,
    )[0];

    return {
      averageTopTenPoints,
      bestThreePointShooter,
      mostCompletePlayer,
      minutesLeader,
    };
  }, [data]);

  const hasData = data.allStats.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.24),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.95),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-red-300">Analytics</p>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  NBA Analytics Dashboard
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Mock advanced player rankings, efficiency signals and league-level insights designed to evolve into a real NBA data workspace.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:w-full sm:max-w-md">
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{data.allStats.length}</p>
                  <p className="mt-1 text-xs text-zinc-400">Players</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">10</p>
                  <p className="mt-1 text-xs text-zinc-400">Rank depth</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">Mock</p>
                  <p className="mt-1 text-xs text-zinc-400">Source</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading analytics dashboard
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Unable to load analytics</h2>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && !hasData ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No analytics available</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Add player statistics to populate scoring, playmaking and efficiency rankings.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && hasData ? (
        <div className="mt-10 space-y-10">
          <section>
            <SectionTitle
              eyebrow="League Insights"
              title="Snapshot metrics"
              description="Quick signals from the mock dataset, calculated from the same player statistics powering the tables."
              icon={Brain}
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InsightCard
                title="Top 10 scoring average"
                value={formatStat(insights.averageTopTenPoints)}
                description="Average points per game among the current top 10 scorers."
                icon={Flame}
              />
              <InsightCard
                title="Best three-point shooter"
                value={insights.bestThreePointShooter?.playerName ?? 'N/A'}
                description={`${formatStat(insights.bestThreePointShooter?.threePointPct ?? 0)}% from three-point range.`}
                icon={Target}
              />
              <InsightCard
                title="Most complete player"
                value={insights.mostCompletePlayer?.playerName ?? 'N/A'}
                description={`Efficiency score: ${formatStat(
                  insights.mostCompletePlayer ? calculatePlayerEfficiency(insights.mostCompletePlayer) : 0,
                )}.`}
                icon={Gauge}
              />
              <InsightCard
                title="Minutes leader"
                value={insights.minutesLeader?.playerName ?? 'N/A'}
                description={`${formatStat(insights.minutesLeader?.minutesPerGame ?? 0)} minutes per game.`}
                icon={Clock3}
              />
            </div>
          </section>

          <section>
            <SectionTitle
              eyebrow="Top Scorers"
              title="Primary shot creators"
              description="Players ranked by points per game with supporting shooting and minute context."
              icon={Flame}
            />
            <div className="mt-5">
              <StatsTable
                title="Top Scorers"
                players={data.topScorers}
                columns={[
                  { key: 'points', label: 'PPG' },
                  { key: 'shooting', label: 'FG% / 3P%' },
                  { key: 'minutes', label: 'MPG' },
                ]}
              />
            </div>
          </section>

          <section>
            <SectionTitle
              eyebrow="Top Playmakers"
              title="Best passing engines"
              description="Players ranked by assists per game with turnovers included for extra context."
              icon={TrendingUp}
            />
            <div className="mt-5">
              <StatsTable
                title="Top Playmakers"
                players={data.topPlaymakers}
                columns={[
                  { key: 'assists', label: 'APG' },
                  { key: 'points', label: 'PPG' },
                  { key: 'efficiency', label: 'EFF' },
                ]}
              />
            </div>
          </section>

          <section>
            <SectionTitle
              eyebrow="Most Efficient Players"
              title="All-around production"
              description="A simple composite view that rewards scoring, rebounding and playmaking while penalizing turnovers."
              icon={Gauge}
            />
            <div className="mt-5">
              <StatsTable
                title="Most Efficient Players"
                players={data.mostEfficient}
                columns={[
                  { key: 'efficiency', label: 'EFF' },
                  { key: 'points', label: 'PPG' },
                  { key: 'rebounds', label: 'RPG' },
                  { key: 'assists', label: 'APG' },
                ]}
              />
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
