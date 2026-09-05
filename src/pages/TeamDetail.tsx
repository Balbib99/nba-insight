import { AlertCircle, ArrowLeft, Loader2, Sparkles, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { HeatLegend } from '../components/HeatLegend';
import { getPlayersByTeamId, getTeamById, getTeamStatsById } from '../services/nbaService';
import type { Player } from '../types/player';
import type { Team } from '../types/team';
import type { TeamStats } from '../types/teamStats';

// Typical NBA team per-game benchmarks, used only to shade stats above/below a realistic baseline.
const LEAGUE_AVERAGE = {
  pointsPerGame: 113,
  reboundsPerGame: 43.5,
  assistsPerGame: 25.5,
  stealsPerGame: 7.5,
  blocksPerGame: 4.8,
  fieldGoalPct: 46.5,
  threePointPct: 36.5,
  winPct: 50,
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
        <div className="flex min-h-96 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading team profile
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackLink to="/teams" label="Back to Teams" />
        <div className="border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h1 className="font-display text-lg font-semibold text-text-primary">Unable to load team</h1>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!team) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackLink to="/teams" label="Back to Teams" />
        <div className="border border-rule bg-ink-900 p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-text-primary">Team not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            This team does not exist in the current mock dataset.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BackLink to="/teams" label="Back to Teams" />

      <div className="relative border-b border-rule pb-8">
        <div className="absolute left-0 top-0 h-[3px] w-16 -skew-x-[20deg] bg-score-orange" aria-hidden="true" />
        <div className="pt-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-ledger-blue">{team.city}</p>
                <DataSourceBadge source="mock" />
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold text-text-primary sm:text-5xl">{team.fullName}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <span>{team.conference} Conference</span>
                <Divider />
                <span>{team.division}</span>
                <Divider />
                <span>{team.abbreviation}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-rule border border-rule sm:w-full sm:max-w-md">
              <div className="p-3 text-center">
                <p className="font-display text-2xl font-bold text-text-primary">{stats?.wins ?? 'N/A'}</p>
                <p className="mt-1 text-xs text-text-secondary">Wins</p>
              </div>
              <div className="p-3 text-center">
                <p className="font-display text-2xl font-bold text-text-primary">{stats?.losses ?? 'N/A'}</p>
                <p className="mt-1 text-xs text-text-secondary">Losses</p>
              </div>
              <div className="p-3 text-center">
                <p className="font-display text-2xl font-bold text-text-primary">
                  {stats ? `${formatStat(getWinPercentage(stats))}%` : 'N/A'}
                </p>
                <p className="mt-1 text-xs text-text-secondary">Win %</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border-t border-rule bg-ink-900 p-5">
          <p className="font-body text-sm text-text-secondary">Record</p>
          {stats ? (
            <dl className="mt-4 divide-y divide-rule border-t border-rule">
              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-text-secondary">Wins</dt>
                <dd className="font-display text-lg font-semibold text-text-primary">{stats.wins}</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-text-secondary">Losses</dt>
                <dd className="font-display text-lg font-semibold text-text-primary">{stats.losses}</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-text-secondary">Conference rank</dt>
                <dd className="font-display text-lg font-semibold text-text-primary">#{stats.conferenceRank}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-text-secondary">No team record available yet.</p>
          )}
        </section>

        <section className="border-t border-rule bg-ink-900 p-5">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Sparkles className="size-4 text-score-orange" aria-hidden="true" />
            Analysis
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">Team read</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{analysis}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
            <Users className="size-4" aria-hidden="true" />
            {roster.length} players in current mock roster
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="font-body text-sm text-text-secondary">Team stats</p>
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
              label="Win %"
              value={`${formatStat(getWinPercentage(stats))}%`}
              helper="Regular-season win rate"
              heat={getHeat(getWinPercentage(stats), LEAGUE_AVERAGE.winPct)}
            />
          </div>
        ) : (
          <div className="border border-rule bg-ink-900 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-text-primary">No team stats available</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              This team exists in the directory, but has no mock aggregate statistics yet.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <p className="mb-5 font-body text-sm text-text-secondary">Roster</p>
        {roster.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {roster.map((player) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="block border-t border-rule bg-ink-900 p-5 transition-colors hover:bg-ledger-blue/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ledger-blue">{player.position}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-text-primary">{player.fullName}</h3>
                  </div>
                  <span className="font-display text-2xl font-bold text-score-orange">{player.age}</span>
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-rule pt-3 text-sm text-text-secondary">
                  <span>{player.height}</span>
                  <Divider />
                  <span>{player.weight}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-rule bg-ink-900 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-text-primary">Empty roster</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              No mock players are currently assigned to this team.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
