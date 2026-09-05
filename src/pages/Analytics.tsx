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
import { DataModeBadge } from '../components/DataModeBadge';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { HeatLegend } from '../components/HeatLegend';
import { InsightCard } from '../components/InsightCard';
import { HeroStatLedger, PageHero } from '../components/PageHero';
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

const heatColumns = ['minutes', 'points', 'rebounds', 'assists', 'fieldGoalPct', 'threePointPct', 'freeThrowPct'] as const;
type HeatColumn = (typeof heatColumns)[number];

function formatStat(value: number): string {
  return value.toFixed(1);
}

function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function getLeaderValue(leader: RealLeagueLeader, column: HeatColumn): number {
  if (column === 'minutes') return leader.minutes;
  if (column === 'points') return leader.points;
  if (column === 'rebounds') return leader.rebounds;
  if (column === 'assists') return leader.assists;
  if (column === 'fieldGoalPct') return leader.fieldGoalPct;
  if (column === 'threePointPct') return leader.threePointPct;
  return leader.freeThrowPct;
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

function RealLeadersTable({ leaders }: { leaders: RealLeagueLeader[] }) {
  const columnStats = useMemo(() => {
    const stats = {} as Record<HeatColumn, { mean: number; spread: number }>;

    for (const column of heatColumns) {
      const values = leaders.map((leader) => getLeaderValue(leader, column));
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
      stats[column] = { mean, spread: Math.sqrt(variance) };
    }

    return stats;
  }, [leaders]);

  return (
    <div className="border border-rule bg-ink-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-5 py-4">
        <h3 className="font-display text-lg font-semibold text-text-primary">Real NBA ranking</h3>
        <HeatLegend />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[980px] divide-y divide-rule text-left text-sm">
          <thead className="text-xs text-text-secondary">
            <tr>
              <th scope="col" className="w-12 px-5 py-3 font-medium">Rank</th>
              <th scope="col" className="min-w-56 px-5 py-3 font-medium">Player</th>
              <th scope="col" className="px-5 py-3 font-medium">Team</th>
              <th scope="col" className="px-5 py-3 font-medium">GP</th>
              <th scope="col" className="px-5 py-3 font-medium">MIN</th>
              <th scope="col" className="px-5 py-3 font-medium">PTS</th>
              <th scope="col" className="px-5 py-3 font-medium">REB</th>
              <th scope="col" className="px-5 py-3 font-medium">AST</th>
              <th scope="col" className="px-5 py-3 font-medium">FG%</th>
              <th scope="col" className="px-5 py-3 font-medium">3PT%</th>
              <th scope="col" className="px-5 py-3 font-medium">FT%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {leaders.map((leader, index) => (
              <tr key={leader.playerId} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-4 font-display text-text-secondary">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="font-medium text-text-primary">{leader.playerName}</div>
                  <div className="mt-1 text-xs text-text-secondary">ID {leader.playerId}</div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-text-primary">{leader.teamAbbreviation}</td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">{leader.gamesPlayed}</td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.minutes, columnStats.minutes.mean, columnStats.minutes.spread)}`}
                >
                  {formatStat(leader.minutes)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.points, columnStats.points.mean, columnStats.points.spread)}`}
                >
                  {formatStat(leader.points)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.rebounds, columnStats.rebounds.mean, columnStats.rebounds.spread)}`}
                >
                  {formatStat(leader.rebounds)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.assists, columnStats.assists.mean, columnStats.assists.spread)}`}
                >
                  {formatStat(leader.assists)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.fieldGoalPct, columnStats.fieldGoalPct.mean, columnStats.fieldGoalPct.spread)}`}
                >
                  {formatPct(leader.fieldGoalPct)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.threePointPct, columnStats.threePointPct.mean, columnStats.threePointPct.spread)}`}
                >
                  {formatPct(leader.threePointPct)}
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary ${getHeatClass(leader.freeThrowPct, columnStats.freeThrowPct.mean, columnStats.freeThrowPct.spread)}`}
                >
                  {formatPct(leader.freeThrowPct)}
                </td>
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
          setRealError('Live data is currently unavailable. Showing demo data so the portfolio experience remains available.');
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
      <PageHero
        eyebrow="Analytics"
        title="NBA Analytics Dashboard"
        description="Real NBA leaderboards now flow through the Node backend, with the demo analytics lab kept as a safe fallback."
        tags={['Powered by nba_api']}
        right={
          <HeroStatLedger
            items={[
              { value: String(realLeaders.length), label: 'Real rows' },
              { value: realStat, label: 'Stat' },
              { value: realSeason, label: 'Season' },
            ]}
          />
        }
      />
      <div className="mt-4">
        <DataModeBadge />
      </div>

      <section className="mt-8 border-t border-rule bg-ink-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold text-text-primary">Real NBA Leaders</h2>
              <span className="border border-rule px-2.5 py-1 text-xs font-medium text-text-secondary">
                Powered by nba_api
              </span>
              {realSuccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                  <CheckCircle2 className="size-3.5 text-live-cyan" aria-hidden="true" />
                  Live data loaded
                </span>
              ) : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
              These rankings come from the backend Node proxy, which calls the Python FastAPI nba_api service.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[160px_180px_auto] sm:items-end">
            <SelectFilter id="real-season" label="Season" options={seasonOptions} value={realSeason} onChange={setRealSeason} />
            <SelectFilter id="real-stat" label="Stat" options={statOptions} value={realStat} onChange={setRealStat} />
            <button
              className="inline-flex h-11 items-center justify-center gap-2 border border-rule px-4 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
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
          <div className="mt-6 flex min-h-40 items-center justify-center border border-rule bg-ink-950">
            <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
              <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
              Loading real NBA leaders
            </div>
          </div>
        ) : null}

        {realError ? (
          <div className="mt-6 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">Live data fallback active</h3>
                <p className="mt-1 text-text-secondary">
                  Live data is currently unavailable. Showing demo data so the portfolio experience remains available.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!isLoadingReal && !realError && realLeaders.length === 0 ? (
          <div className="mt-6 border border-rule bg-ink-950 p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-text-primary">No real leaders found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">Try another season or stat category.</p>
          </div>
        ) : null}

        {!isLoadingReal && !realError && realLeaders.length > 0 ? (
          <div className="mt-6">
            <RealLeadersTable leaders={realLeaders} />
          </div>
        ) : null}
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-rule pt-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">Mock Analytics Lab</h2>
        <DataSourceBadge source="mock" />
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
        Demo rankings remain visible as a fallback while real NBA data is integrated progressively.
      </p>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading demo analytics dashboard
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">Unable to load demo analytics</h2>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && !hasData ? (
        <div className="mt-8 border border-rule bg-ink-900 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-text-primary">No demo analytics available</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Add player statistics to populate scoring, playmaking and efficiency rankings.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && hasData ? (
        <div className="mt-4 space-y-10">
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
