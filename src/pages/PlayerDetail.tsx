import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BadgePercent,
  BarChart3,
  Clock3,
  Flag,
  Loader2,
  MapPin,
  Ruler,
  Scale,
  Shield,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { FavoriteButton } from '../components/FavoriteButton';
import { getPlayerById, getStatsByPlayerId } from '../services/nbaService';
import type { Player } from '../types/player';
import type { PlayerStats } from '../types/playerStats';

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
}

function formatStat(value: number): string {
  return value.toFixed(1);
}

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-lg shadow-black/20">
      <p className="text-sm font-medium text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-zinc-500">{helper}</p>
    </article>
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
        <div className="flex min-h-96 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading player profile
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/players"
          className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Players
        </Link>
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h1 className="font-semibold text-white">Unable to load player</h1>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!player) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/players"
          className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Players
        </Link>
        <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Player not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            This player does not exist in the current mock dataset.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/players"
        className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Players
      </Link>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.26),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.96),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-red-300">{player.teamName}</p>
                  <DataSourceBadge source="mock" />
                </div>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  {player.fullName}
                </h1>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
                    <Shield className="size-4 text-red-300" aria-hidden="true" />
                    {player.position}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
                    <Flag className="size-4 text-red-300" aria-hidden="true" />
                    {player.country}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
                    <UserRound className="size-4 text-red-300" aria-hidden="true" />
                    {player.age} years old
                  </span>
                </div>
              </div>
              <div className="sm:w-full sm:max-w-md">
                <div className="mb-3 flex justify-start lg:justify-end">
                  <FavoriteButton player={player} variant="full" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                    <p className="text-2xl font-semibold text-white">{stats ? formatStat(stats.pointsPerGame) : 'N/A'}</p>
                    <p className="mt-1 text-xs text-zinc-400">PPG</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                    <p className="text-2xl font-semibold text-white">{stats ? formatStat(stats.assistsPerGame) : 'N/A'}</p>
                    <p className="mt-1 text-xs text-zinc-400">APG</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                    <p className="text-2xl font-semibold text-white">{stats ? formatStat(stats.reboundsPerGame) : 'N/A'}</p>
                    <p className="mt-1 text-xs text-zinc-400">RPG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <Activity className="size-4" aria-hidden="true" />
            Profile
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/[0.04] p-4">
              <dt className="flex items-center gap-2 text-sm text-zinc-500">
                <Ruler className="size-4" aria-hidden="true" />
                Height
              </dt>
              <dd className="mt-2 font-semibold text-white">{player.height}</dd>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-4">
              <dt className="flex items-center gap-2 text-sm text-zinc-500">
                <Scale className="size-4" aria-hidden="true" />
                Weight
              </dt>
              <dd className="mt-2 font-semibold text-white">{player.weight}</dd>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-4">
              <dt className="flex items-center gap-2 text-sm text-zinc-500">
                <BarChart3 className="size-4" aria-hidden="true" />
                Games Played
              </dt>
              <dd className="mt-2 font-semibold text-white">{stats?.gamesPlayed ?? 'N/A'}</dd>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-4">
              <dt className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock3 className="size-4" aria-hidden="true" />
                Minutes Per Game
              </dt>
              <dd className="mt-2 font-semibold text-white">
                {stats ? formatStat(stats.minutesPerGame) : 'N/A'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <Sparkles className="size-4" aria-hidden="true" />
            Analysis
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Player read</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{analysis}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
            <MapPin className="size-4" aria-hidden="true" />
            Based on current mock per-game profile
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-red-300">
          <BadgePercent className="size-4" aria-hidden="true" />
          Stats
        </div>
        {stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="PPG" value={formatStat(stats.pointsPerGame)} helper="Points per game" />
            <StatCard label="RPG" value={formatStat(stats.reboundsPerGame)} helper="Rebounds per game" />
            <StatCard label="APG" value={formatStat(stats.assistsPerGame)} helper="Assists per game" />
            <StatCard label="SPG" value={formatStat(stats.stealsPerGame)} helper="Steals per game" />
            <StatCard label="BPG" value={formatStat(stats.blocksPerGame)} helper="Blocks per game" />
            <StatCard label="FG%" value={`${formatStat(stats.fieldGoalPct)}%`} helper="Field goal percentage" />
            <StatCard label="3PT%" value={`${formatStat(stats.threePointPct)}%`} helper="Three-point percentage" />
            <StatCard label="FT%" value={`${formatStat(stats.freeThrowPct)}%`} helper="Free throw percentage" />
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
            <h2 className="text-xl font-semibold text-white">No stats available</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              This player exists in the roster dataset, but has no mock statistics yet.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
