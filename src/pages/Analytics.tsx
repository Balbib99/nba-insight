import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Loader2,
  RefreshCw,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { InsightCard } from '../components/InsightCard';
import { SectionTitle } from '../components/SectionTitle';
import { SelectFilter, type SelectOption } from '../components/SelectFilter';
import { StatsTable } from '../components/StatsTable';
import {
  calculatePlayerEfficiency,
  getMostEfficientPlayers,
  getPlayerStats,
  getRealLeagueLeaders,
  getTopAssistPlayers,
  getTopScorers,
} from '../services/nbaService';
import type { PlayerStats } from '../types/playerStats';
import type { RealLeagueLeader } from '../types/realLeagueLeader';

interface AnalyticsData {
  allStats: PlayerStats[];
  topScorers: PlayerStats[];
  topPlaymakers: PlayerStats[];
  mostEfficient: PlayerStats[];
}

const seasonOptions: SelectOption[] = [
  { label: '2024-25', value: '2024-25' },
  { label: '2023-24', value: '2023-24' },
  { label: '2022-23', value: '2022-23' },
];

const statOptions: SelectOption[] = [
  { label: 'Points', value: 'PTS' },
  { label: 'Rebounds', value: 'REB' },
  { label: 'Assists', value: 'AST' },
  { label: 'Steals', value: 'STL' },
  { label: 'Blocks', value: 'BLK' },
  { label: 'Field Goal %', value: 'FG_PCT' },
  { label: '3PT %', value: 'FG3_PCT' },
  { label: 'Free Throw %', value: 'FT_PCT' },
];

function formatStat(value: number): string {
  return value.toFixed(1);
}

function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function RealLeadersTable({ leaders }: { leaders: RealLeagueLeader[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Real NBA ranking</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[980px] divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase text-zinc-500">
            <tr>
              <th className="w-12 px-5 py-3 font-semibold">Rank</th>
              <th className="min-w-56 px-5 py-3 font-semibold">Player</th>
              <th className="px-5 py-3 font-semibold">Team</th>
              <th className="px-5 py-3 font-semibold">GP</th>
              <th className="px-5 py-3 font-semibold">MIN</th>
              <th className="px-5 py-3 font-semibold">PTS</th>
              <th className="px-5 py-3 font-semibold">REB</th>
              <th className="px-5 py-3 font-semibold">AST</th>
              <th className="px-5 py-3 font-semibold">FG%</th>
              <th className="px-5 py-3 font-semibold">3PT%</th>
              <th className="px-5 py-3 font-semibold">FT%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {leaders.map((leader, index) => (
              <tr key={leader.playerId} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-4 font-semibold text-zinc-500">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-white">{leader.playerName}</div>
                  <div className="mt-1 text-xs text-zinc-500">ID {leader.playerId}</div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-zinc-100">
                  {leader.teamAbbreviation}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{leader.gamesPlayed}</td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatStat(leader.minutes)}</td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-white">{formatStat(leader.points)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatStat(leader.rebounds)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatStat(leader.assists)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatPct(leader.fieldGoalPct)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatPct(leader.threePointPct)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatPct(leader.freeThrowPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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
  const [realSeason, setRealSeason] = useState('2024-25');
  const [realStat, setRealStat] = useState('PTS');
  const [realLeaders, setRealLeaders] = useState<RealLeagueLeader[]>([]);
  const [isLoadingReal, setIsLoadingReal] = useState(true);
  const [realError, setRealError] = useState<string | null>(null);
  const [realSuccess, setRealSuccess] = useState(false);
  const [realRefreshKey, setRealRefreshKey] = useState(0);

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

  useEffect(() => {
    let isMounted = true;

    async function loadRealLeaders() {
      try {
        setIsLoadingReal(true);
        setRealError(null);
        setRealSuccess(false);

        const leaders = await getRealLeagueLeaders({
          season: realSeason,
          stat: realStat,
          season_type: 'Regular Season',
        });

        if (isMounted) {
          setRealLeaders(leaders);
          setRealSuccess(true);
        }
      } catch {
        if (isMounted) {
          setRealLeaders([]);
          setRealError('Real NBA data is temporarily unavailable.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingReal(false);
        }
      }
    }

    void loadRealLeaders();

    return () => {
      isMounted = false;
    };
  }, [realRefreshKey, realSeason, realStat]);

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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-red-300">Analytics</p>
                  <span className="inline-flex h-7 items-center rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-2.5 text-xs font-semibold text-emerald-100">
                    Powered by nba_api
                  </span>
                </div>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  NBA Analytics Dashboard
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Real NBA leaderboards now flow through the Node backend, with the demo analytics lab kept as a safe fallback.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:w-full sm:max-w-md">
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{realLeaders.length}</p>
                  <p className="mt-1 text-xs text-zinc-400">Real rows</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{realStat}</p>
                  <p className="mt-1 text-xs text-zinc-400">Stat</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{realSeason}</p>
                  <p className="mt-1 text-xs text-zinc-400">Season</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold text-white">Real NBA Leaders</h2>
              <span className="inline-flex h-7 items-center rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-2.5 text-xs font-semibold text-emerald-100">
                Powered by nba_api
              </span>
              {realSuccess ? (
                <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs font-medium text-zinc-300">
                  <CheckCircle2 className="size-3.5 text-emerald-300" aria-hidden="true" />
                  Live data loaded
                </span>
              ) : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              These rankings come from the backend Node proxy, which calls the Python FastAPI nba_api service.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[160px_180px_auto] sm:items-end">
            <SelectFilter
              id="real-season"
              label="Season"
              options={seasonOptions}
              value={realSeason}
              onChange={setRealSeason}
            />
            <SelectFilter
              id="real-stat"
              label="Stat"
              options={statOptions}
              value={realStat}
              onChange={setRealStat}
            />
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
              type="button"
              onClick={() => {
                setRealRefreshKey((currentKey) => currentKey + 1);
              }}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        {isLoadingReal ? (
          <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
              <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
              Loading real NBA leaders
            </div>
          </div>
        ) : null}

        {realError ? (
          <div className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-white">Real NBA data is temporarily unavailable.</h3>
                <p className="mt-1 text-red-100/80">
                  The demo analytics sections below remain available while the live feed recovers.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!isLoadingReal && !realError && realLeaders.length === 0 ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
            <h3 className="text-xl font-semibold text-white">No real leaders found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              Try another season or stat category.
            </p>
          </div>
        ) : null}

        {!isLoadingReal && !realError && realLeaders.length > 0 ? (
          <div className="mt-6">
            <RealLeadersTable leaders={realLeaders} />
          </div>
        ) : null}
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-semibold text-white">Mock Analytics Lab</h2>
        <DataSourceBadge source="mock" />
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
        Demo rankings remain visible as a fallback while real NBA data is integrated progressively.
      </p>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading demo analytics dashboard
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Unable to load demo analytics</h2>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && !hasData ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No demo analytics available</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Add player statistics to populate scoring, playmaking and efficiency rankings.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && hasData ? (
        <div className="mt-10 space-y-10">
          <section>
            <SectionTitle
              eyebrow="Demo Analytics"
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
              eyebrow="Demo Top Scorers"
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
              eyebrow="Demo Top Playmakers"
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
              eyebrow="Demo Efficiency"
              title="Most Efficient Players"
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
