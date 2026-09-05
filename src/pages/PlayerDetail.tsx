import { AlertCircle, ArrowLeft, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { FavoriteButton } from '../components/FavoriteButton';
import { HeatLegend } from '../components/HeatLegend';
import { getPlayerById, getStatsByPlayerId } from '../services/nbaService';
import type { Player } from '../types/player';
import type { PlayerStats } from '../types/playerStats';

// Typical NBA per-game benchmarks, used only to shade stats above/below a realistic baseline.
const LEAGUE_AVERAGE = {
  pointsPerGame: 11.5,
  reboundsPerGame: 4.4,
  assistsPerGame: 2.6,
  stealsPerGame: 0.7,
  blocksPerGame: 0.4,
  fieldGoalPct: 46,
  threePointPct: 35.5,
  freeThrowPct: 77,
};

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  heat?: 'hot' | 'cold' | null;
}

function formatStat(value: number): string {
  return value.toFixed(1);
}

function getHeat(value: number, benchmark: number): 'hot' | 'cold' | null {
  if (value > benchmark * 1.1) {
    return 'hot';
  }

  if (value < benchmark * 0.9) {
    return 'cold';
  }

  return null;
}

function Divider() {
  return <span className="h-3 w-px bg-rule" aria-hidden="true" />;
}

function StatCard({ label, value, helper, heat }: StatCardProps) {
  const heatClass = heat === 'hot' ? 'bg-score-orange/10' : heat === 'cold' ? 'bg-live-cyan/10' : '';

  return (
    <article className={`border-t border-rule bg-ink-900 p-5 ${heatClass}`}>
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-text-primary">{value}</p>
      <p className="mt-2 text-xs text-text-secondary">{helper}</p>
    </article>
  );
}

function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="mb-6 inline-flex h-10 items-center gap-2 border border-rule px-4 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function buildPlayerAnalysis(player: Player, stats?: PlayerStats): string {
  if (!stats) {
    return `${player.fullName} has a profile ready for deeper analysis once statistical data is available.`;
  }

  if (stats.pointsPerGame >= 28 && stats.assistsPerGame >= 7) {
    return 'Elite offensive engine with star-level scoring volume and high playmaking responsibility.';
  }

  if (stats.pointsPerGame >= 25) {
    return 'Elite scorer with high offensive usage and reliable shot creation across heavy minutes.';
  }

  if (stats.assistsPerGame >= 7) {
    return 'Playmaker focused guard who drives team offense through passing pressure and ball control.';
  }

  if (stats.stealsPerGame >= 1.1 && stats.blocksPerGame >= 0.8) {
    return 'Strong two-way player with defensive activity and enough offensive production to impact both ends.';
  }

  if (stats.reboundsPerGame >= 10 || stats.blocksPerGame >= 2) {
    return 'Interior anchor with strong paint presence, rebounding value and defensive disruption.';
  }

  if (stats.threePointPct >= 40) {
    return 'High-efficiency shooter who spaces the floor and converts perimeter looks at an elite rate.';
  }

  return 'Balanced contributor with a stable statistical profile and room for more specialized role analysis.';
}

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlayerDetail() {
      if (!id) {
        setError('Player id is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [loadedPlayer, loadedStats] = await Promise.all([
          getPlayerById(id),
          getStatsByPlayerId(id),
        ]);

        if (isMounted) {
          setPlayer(loadedPlayer ?? null);
          setStats(loadedStats ?? null);
        }
      } catch {
        if (isMounted) {
          setError('Player details could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPlayerDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const analysis = useMemo(() => (player ? buildPlayerAnalysis(player, stats ?? undefined) : ''), [player, stats]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex min-h-96 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading player profile
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackLink to="/players" label="Back to Players" />
        <div className="border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h1 className="font-display text-lg font-semibold text-text-primary">Unable to load player</h1>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!player) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackLink to="/players" label="Back to Players" />
        <div className="border border-rule bg-ink-900 p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-text-primary">Player not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            This player does not exist in the current mock dataset.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BackLink to="/players" label="Back to Players" />

      <div className="relative border-b border-rule pb-8">
        <div className="absolute left-0 top-0 h-[3px] w-16 -skew-x-[20deg] bg-score-orange" aria-hidden="true" />
        <div className="pt-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-ledger-blue">{player.teamName}</p>
                <DataSourceBadge source="mock" />
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold text-text-primary sm:text-5xl">
                {player.fullName}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <span>{player.position}</span>
                <Divider />
                <span>{player.country}</span>
                <Divider />
                <span>{player.age} years old</span>
              </div>
            </div>
            <div className="sm:w-full sm:max-w-md">
              <div className="mb-3 flex justify-start lg:justify-end">
                <FavoriteButton player={player} variant="full" />
              </div>
              <div className="grid grid-cols-3 divide-x divide-rule border border-rule">
                <div className="p-3 text-center">
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {stats ? formatStat(stats.pointsPerGame) : 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">PPG</p>
                </div>
                <div className="p-3 text-center">
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {stats ? formatStat(stats.assistsPerGame) : 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">APG</p>
                </div>
                <div className="p-3 text-center">
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {stats ? formatStat(stats.reboundsPerGame) : 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">RPG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border-t border-rule bg-ink-900 p-5">
          <p className="font-body text-sm text-text-secondary">Profile</p>
          <dl className="mt-4 divide-y divide-rule border-t border-rule">
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-text-secondary">Height</dt>
              <dd className="font-display text-base font-semibold text-text-primary">{player.height}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-text-secondary">Weight</dt>
              <dd className="font-display text-base font-semibold text-text-primary">{player.weight}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-text-secondary">Games played</dt>
              <dd className="font-display text-base font-semibold text-text-primary">{stats?.gamesPlayed ?? 'N/A'}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-text-secondary">Minutes per game</dt>
              <dd className="font-display text-base font-semibold text-text-primary">
                {stats ? formatStat(stats.minutesPerGame) : 'N/A'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="border-t border-rule bg-ink-900 p-5">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Sparkles className="size-4 text-score-orange" aria-hidden="true" />
            Analysis
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">Player read</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{analysis}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="size-4" aria-hidden="true" />
            Based on current mock per-game profile
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="font-body text-sm text-text-secondary">Stats</p>
          {stats ? <HeatLegend label="league average" /> : null}
        </div>
        {stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="PPG"
              value={formatStat(stats.pointsPerGame)}
              helper="Points per game"
              heat={getHeat(stats.pointsPerGame, LEAGUE_AVERAGE.pointsPerGame)}
            />
            <StatCard
              label="RPG"
              value={formatStat(stats.reboundsPerGame)}
              helper="Rebounds per game"
              heat={getHeat(stats.reboundsPerGame, LEAGUE_AVERAGE.reboundsPerGame)}
            />
            <StatCard
              label="APG"
              value={formatStat(stats.assistsPerGame)}
              helper="Assists per game"
              heat={getHeat(stats.assistsPerGame, LEAGUE_AVERAGE.assistsPerGame)}
            />
            <StatCard
              label="SPG"
              value={formatStat(stats.stealsPerGame)}
              helper="Steals per game"
              heat={getHeat(stats.stealsPerGame, LEAGUE_AVERAGE.stealsPerGame)}
            />
            <StatCard
              label="BPG"
              value={formatStat(stats.blocksPerGame)}
              helper="Blocks per game"
              heat={getHeat(stats.blocksPerGame, LEAGUE_AVERAGE.blocksPerGame)}
            />
            <StatCard
              label="FG%"
              value={`${formatStat(stats.fieldGoalPct)}%`}
              helper="Field goal percentage"
              heat={getHeat(stats.fieldGoalPct, LEAGUE_AVERAGE.fieldGoalPct)}
            />
            <StatCard
              label="3PT%"
              value={`${formatStat(stats.threePointPct)}%`}
              helper="Three-point percentage"
              heat={getHeat(stats.threePointPct, LEAGUE_AVERAGE.threePointPct)}
            />
            <StatCard
              label="FT%"
              value={`${formatStat(stats.freeThrowPct)}%`}
              helper="Free throw percentage"
              heat={getHeat(stats.freeThrowPct, LEAGUE_AVERAGE.freeThrowPct)}
            />
          </div>
        ) : (
          <div className="border border-rule bg-ink-900 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-text-primary">No stats available</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              This player exists in the roster dataset, but has no mock statistics yet.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
