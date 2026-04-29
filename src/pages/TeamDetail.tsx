import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BadgePercent,
  Flag,
  Gauge,
  Loader2,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlayersByTeamId, getTeamById, getTeamStatsById } from '../services/nbaService';
import type { Player } from '../types/player';
import type { Team } from '../types/team';
import type { TeamStats } from '../types/teamStats';

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
}

function formatStat(value: number): string {
  return value.toFixed(1);
}

function getWinPercentage(stats: TeamStats): number {
  const totalGames = stats.wins + stats.losses;
  return totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
}

function buildTeamAnalysis(team: Team, stats?: TeamStats, rosterCount = 0): string {
  if (!stats) {
    return `${team.fullName} has a team profile ready for deeper analysis once aggregate statistics are available.`;
  }

  const winPct = getWinPercentage(stats);
  const strongOffense = stats.pointsPerGame >= 117 || stats.assistsPerGame >= 28;
  const solidDefense = stats.stealsPerGame >= 8 || stats.blocksPerGame >= 6;

  if (winPct < 45 && rosterCount <= 1) {
    return 'Team in rebuilding mode with a limited current mock roster and room to define a clearer statistical identity.';
  }

  if (strongOffense && solidDefense) {
    return 'Balanced contender profile with strong offensive production and reliable defensive activity.';
  }

  if (strongOffense) {
    return 'Strong offensive team built around scoring volume, ball movement and efficient shot creation.';
  }

  if (solidDefense) {
    return 'Solid defensive team with disruptive activity, rim protection and a profile that can slow opponents down.';
  }

  if (winPct < 45) {
    return 'Team in reconstruction with useful pieces, but the current profile still needs more efficient production.';
  }

  return 'Balanced team with steady production across major categories and a competitive regular-season profile.';
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

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [roster, setRoster] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTeamDetail() {
      if (!id) {
        setError('Team id is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [loadedTeam, loadedStats, loadedRoster] = await Promise.all([
          getTeamById(id),
          getTeamStatsById(id),
          getPlayersByTeamId(id),
        ]);

        if (isMounted) {
          setTeam(loadedTeam ?? null);
          setStats(loadedStats ?? null);
          setRoster(loadedRoster);
        }
      } catch {
        if (isMounted) {
          setError('Team details could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTeamDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const analysis = useMemo(
    () => (team ? buildTeamAnalysis(team, stats ?? undefined, roster.length) : ''),
    [roster.length, stats, team],
  );

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex min-h-96 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading team profile
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/teams"
          className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Teams
        </Link>
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h1 className="font-semibold text-white">Unable to load team</h1>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!team) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/teams"
          className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Teams
        </Link>
        <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Team not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            This team does not exist in the current mock dataset.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/teams"
        className="mb-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Teams
      </Link>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.26),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.96),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-red-300">{team.city}</p>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  {team.fullName}
                </h1>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
                    <Shield className="size-4 text-red-300" aria-hidden="true" />
                    {team.conference} Conference
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
                    <Flag className="size-4 text-red-300" aria-hidden="true" />
                    {team.division}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
                    <Trophy className="size-4 text-red-300" aria-hidden="true" />
                    {team.abbreviation}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:w-full sm:max-w-md">
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{stats?.wins ?? 'N/A'}</p>
                  <p className="mt-1 text-xs text-zinc-400">Wins</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{stats?.losses ?? 'N/A'}</p>
                  <p className="mt-1 text-xs text-zinc-400">Losses</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">
                    {stats ? `${formatStat(getWinPercentage(stats))}%` : 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">Win %</p>
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
            Record
          </div>
          {stats ? (
            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white/[0.04] p-4">
                <dt className="text-sm text-zinc-500">Wins</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">{stats.wins}</dd>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-4">
                <dt className="text-sm text-zinc-500">Losses</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">{stats.losses}</dd>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-4">
                <dt className="text-sm text-zinc-500">Conf. Rank</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">#{stats.conferenceRank}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">No team record available yet.</p>
          )}
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <Sparkles className="size-4" aria-hidden="true" />
            Analysis
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Team read</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{analysis}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
            <Users className="size-4" aria-hidden="true" />
            {roster.length} players in current mock roster
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-red-300">
          <BadgePercent className="size-4" aria-hidden="true" />
          Team Stats
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
            <StatCard label="Win %" value={`${formatStat(getWinPercentage(stats))}%`} helper="Regular-season win rate" />
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
            <h2 className="text-xl font-semibold text-white">No team stats available</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              This team exists in the directory, but has no mock aggregate statistics yet.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-red-300">
          <Users className="size-4" aria-hidden="true" />
          Roster
        </div>
        {roster.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {roster.map((player) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-red-300">{player.position}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{player.fullName}</h3>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-sm font-bold text-red-200">
                    {player.age}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-zinc-400">
                  <Gauge className="size-4" aria-hidden="true" />
                  {player.height} - {player.weight}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
            <h2 className="text-xl font-semibold text-white">Empty roster</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              No mock players are currently assigned to this team.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
