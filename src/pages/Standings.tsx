import { AlertCircle, CheckCircle2, GitBranch, Loader2, Table2, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataModeBadge } from '../components/DataModeBadge';
import { SelectFilter, type SelectOption } from '../components/SelectFilter';
import { playoffBrackets, type PlayoffSeries } from '../data/playoffBrackets';
import { seasonChampions } from '../data/seasonChampions';
import { getRealStandings } from '../services/nbaService';
import type { RealStanding } from '../types/realStanding';

type ConferenceFilter = 'all' | 'East' | 'West';

const seasonOptions: SelectOption[] = [
  { label: '2025-26', value: '2025-26' },
  { label: '2024-25', value: '2024-25' },
  { label: '2023-24', value: '2023-24' },
];

const conferenceOptions: SelectOption[] = [
  { label: 'All', value: 'all' },
  { label: 'East', value: 'East' },
  { label: 'West', value: 'West' },
];

function formatWinPct(value: number): string {
  return value.toFixed(3).replace(/^0/, '');
}

function playoffStatus(rank: number): 'Playoffs' | 'Play-in' | 'Outside' {
  if (rank <= 6) {
    return 'Playoffs';
  }

  if (rank <= 10) {
    return 'Play-in';
  }

  return 'Outside';
}

function statusClasses(status: ReturnType<typeof playoffStatus>): string {
  if (status === 'Playoffs') {
    return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  }

  if (status === 'Play-in') {
    return 'border-amber-300/30 bg-amber-400/10 text-amber-100';
  }

  return 'border-white/10 bg-white/[0.04] text-zinc-300';
}

function ChampionSummary({ season }: { season: string }) {
  const champion = seasonChampions.find((seasonChampion) => seasonChampion.season === season);

  if (!champion) {
    return (
      <section className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-300">
            <Trophy className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">{season} Champion</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Not decided yet</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Championship data will appear here once the postseason is complete.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-amber-300/20 bg-zinc-900/80 shadow-xl shadow-black/20">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="bg-amber-400/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-300/10 text-amber-100">
              <Trophy className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-100">{season} Champion</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{champion.champion}</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-amber-50/80">{champion.note}</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">Finals</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {champion.champion} {champion.finalsResult}
            </p>
            <p className="mt-1 text-sm text-zinc-400">{champion.runnerUp}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">Runner-up</p>
            <p className="mt-2 text-lg font-semibold text-white">{champion.runnerUp}</p>
            <p className="mt-1 text-sm text-zinc-400">NBA Finals finalist</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">Finals MVP</p>
            <p className="mt-2 text-lg font-semibold text-white">{champion.finalsMvp}</p>
            <p className="mt-1 text-sm text-zinc-400">Postseason award</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeriesCard({ series }: { series: PlayoffSeries }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold text-white">{series.winner}</p>
        <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-100">
          {series.result}
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-zinc-500">def. {series.loser}</p>
    </div>
  );
}

function PlayoffBracket({ season }: { season: string }) {
  const bracket = playoffBrackets.find((playoffBracket) => playoffBracket.season === season);
  const rounds: PlayoffSeries['round'][] = [
    'First Round',
    'Conference Semifinals',
    'Conference Finals',
    'NBA Finals',
  ];

  if (!bracket) {
    return (
      <section className="rounded-lg border border-white/10 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-300">
            <GitBranch className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Playoff bracket unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              The bracket for this season will be added once playoff results are available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <GitBranch className="size-4" aria-hidden="true" />
            Playoff bracket
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{season} postseason path</h2>
        </div>
        <span className="inline-flex w-fit rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-300">
          Local historical data
        </span>
      </div>
      <div className="mt-5 overflow-x-auto">
        <div className="grid min-w-[980px] grid-cols-4 gap-4">
          {rounds.map((round) => {
            const roundSeries = bracket.series.filter((series) => series.round === round);

            return (
              <div key={round} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-zinc-500">{round}</h3>
                {roundSeries.map((series) => (
                  <SeriesCard
                    key={`${series.conference}-${series.round}-${series.winner}-${series.loser}`}
                    series={series}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StandingsTable({ teams, title }: { teams: RealStanding[]; title: string }) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{teams.length} teams</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-emerald-100">
            1-6 Playoffs
          </span>
          <span className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-amber-100">
            7-10 Play-in
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase text-zinc-500">
            <tr>
              <th className="w-16 px-5 py-3 font-semibold">Rank</th>
              <th className="min-w-64 px-5 py-3 font-semibold">Team</th>
              <th className="px-5 py-3 font-semibold">W</th>
              <th className="px-5 py-3 font-semibold">L</th>
              <th className="px-5 py-3 font-semibold">Win %</th>
              <th className="px-5 py-3 font-semibold">Home</th>
              <th className="px-5 py-3 font-semibold">Away</th>
              <th className="px-5 py-3 font-semibold">Last 10</th>
              <th className="px-5 py-3 font-semibold">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {teams.map((team) => {
              const status = playoffStatus(team.conferenceRank);

              return (
                <tr key={team.teamId} className="transition hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">#{team.conferenceRank}</div>
                    <span
                      className={`mt-1 inline-flex rounded-lg border px-2 py-0.5 text-xs font-medium ${statusClasses(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">
                      {team.teamCity} {team.teamName}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {team.teamAbbreviation || 'NBA'} - {team.division}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-white">{team.wins}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{team.losses}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{formatWinPct(team.winPct)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{team.homeRecord}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{team.awayRecord}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{team.lastTen}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-zinc-300">{team.streak || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Standings() {
  const [season, setSeason] = useState('2025-26');
  const [conference, setConference] = useState<ConferenceFilter>('all');
  const [standings, setStandings] = useState<RealStanding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStandings() {
      try {
        setIsLoading(true);
        setError(null);

        const loadedStandings = await getRealStandings({
          season,
          season_type: 'Regular Season',
        });

        if (isMounted) {
          setStandings(loadedStandings);
        }
      } catch {
        if (isMounted) {
          setStandings([]);
          setError('Live standings are currently unavailable. Showing demo standings when fallback data is available.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadStandings();

    return () => {
      isMounted = false;
    };
  }, [season]);

  const filteredStandings = useMemo(() => {
    return standings
      .filter((team) => conference === 'all' || team.conference === conference)
      .sort((teamA, teamB) => teamA.conferenceRank - teamB.conferenceRank);
  }, [conference, standings]);

  const easternTeams = filteredStandings.filter((team) => team.conference === 'East');
  const westernTeams = filteredStandings.filter((team) => team.conference === 'West');

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.24),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.95),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-red-300">Standings</p>
                  <span className="inline-flex h-7 items-center rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-2.5 text-xs font-semibold text-emerald-100">
                    Powered by API-Sports
                  </span>
                  <DataModeBadge />
                </div>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  NBA Standings
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Real regular-season conference standings delivered through Node with PostgreSQL cache.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:w-full sm:max-w-md">
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{standings.length}</p>
                  <p className="mt-1 text-xs text-zinc-400">Teams</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{season}</p>
                  <p className="mt-1 text-xs text-zinc-400">Season</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">
                    {conference === 'all' ? 'All' : conference}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">Conference</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <ChampionSummary season={season} />
        <PlayoffBracket season={season} />
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/20">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <SelectFilter
            id="standings-season"
            label="Season"
            options={seasonOptions}
            value={season}
            onChange={setSeason}
          />
          <SelectFilter
            id="standings-conference"
            label="Conference"
            options={conferenceOptions}
            value={conference}
            onChange={(value) => setConference(value as ConferenceFilter)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading real standings
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Live standings are temporarily unavailable.</h2>
              <p className="mt-1 text-red-100/80">
                NBA Insight can continue with demo or cached data depending on the selected data mode.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && filteredStandings.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
            <Table2 className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">No standings found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Try another season or conference filter.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && filteredStandings.length > 0 ? (
        <div className="mt-8 space-y-8">
          {conference !== 'West' && easternTeams.length > 0 ? (
            <StandingsTable title="Eastern Conference" teams={easternTeams} />
          ) : null}
          {conference !== 'East' && westernTeams.length > 0 ? (
            <StandingsTable title="Western Conference" teams={westernTeams} />
          ) : null}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <CheckCircle2 className="size-4 text-emerald-300" aria-hidden="true" />
            Standings loaded from API-Sports through the NBA Insight backend.
          </div>
        </div>
      ) : null}
    </section>
  );
}
