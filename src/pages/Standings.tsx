import { AlertCircle, CheckCircle2, GitBranch, Loader2, Table2, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataModeBadge } from '../components/DataModeBadge';
import { HeroStatLedger, PageHero } from '../components/PageHero';
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

function playoffStatus(rank: number): 'Playoffs seed' | 'Play-in seed' | 'Outside' {
  if (rank <= 6) {
    return 'Playoffs seed';
  }

  if (rank <= 10) {
    return 'Play-in seed';
  }

  return 'Outside';
}

function ChampionSummary({ season }: { season: string }) {
  const champion = seasonChampions.find((seasonChampion) => seasonChampion.season === season);

  if (!champion) {
    return (
      <section className="border-t border-rule bg-ink-900 p-5">
        <div className="flex items-start gap-4">
          <Trophy className="mt-1 size-5 shrink-0 text-text-secondary" aria-hidden="true" />
          <div>
            <p className="text-sm text-text-secondary">{season} Champion</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">Not decided yet</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Championship data will appear here once the postseason is complete.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-rule bg-ink-900">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <Trophy className="size-6 text-score-orange" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text-secondary">{season} Champion</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-text-primary">{champion.champion}</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-text-secondary">{champion.note}</p>
        </div>
        <div className="grid gap-4 border-t border-rule p-6 sm:grid-cols-3 lg:border-l lg:border-t-0">
          <div>
            <p className="text-xs text-text-secondary">Finals</p>
            <p className="mt-2 font-display text-lg font-semibold text-text-primary">
              {champion.champion} {champion.finalsResult}
            </p>
            <p className="mt-1 text-sm text-text-secondary">{champion.runnerUp}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Runner-up</p>
            <p className="mt-2 font-display text-lg font-semibold text-text-primary">{champion.runnerUp}</p>
            <p className="mt-1 text-sm text-text-secondary">NBA Finals finalist</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Finals MVP</p>
            <p className="mt-2 font-display text-lg font-semibold text-text-primary">{champion.finalsMvp}</p>
            <p className="mt-1 text-sm text-text-secondary">Postseason award</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeriesRow({ series }: { series: PlayoffSeries }) {
  return (
    <div className="border-t border-rule py-2">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-text-primary">{series.winner}</p>
        <span className="font-display text-sm font-semibold text-score-orange">{series.result}</span>
      </div>
      <p className="mt-0.5 truncate text-xs text-text-secondary">def. {series.loser}</p>
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
      <section className="border-t border-rule bg-ink-900 p-6">
        <div className="flex items-start gap-4">
          <GitBranch className="mt-1 size-5 shrink-0 text-text-secondary" aria-hidden="true" />
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">Playoff bracket unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              The bracket for this season will be added once playoff results are available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-rule bg-ink-900 p-5">
      <div className="flex flex-col gap-3 border-b border-rule pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <GitBranch className="size-4 text-score-orange" aria-hidden="true" />
            Playoff bracket
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">{season} postseason path</h2>
        </div>
        <span className="inline-flex w-fit border border-rule px-3 py-1 text-xs font-medium text-text-secondary">
          Local historical data
        </span>
      </div>
      <div className="mt-5 overflow-x-auto">
        <div className="grid min-w-[980px] grid-cols-4 divide-x divide-rule">
          {rounds.map((round) => {
            const roundSeries = bracket.series.filter((series) => series.round === round);

            return (
              <div key={round} className="px-4 first:pl-0 last:pr-0">
                <h3 className="text-sm text-text-secondary">{round}</h3>
                {roundSeries.map((series) => (
                  <SeriesRow
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
    <section className="border border-rule bg-ink-900">
      <div className="border-b border-rule px-5 py-4">
        <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{teams.length} teams</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[860px] divide-y divide-rule text-left text-sm">
          <thead className="text-xs text-text-secondary">
            <tr>
              <th scope="col" className="w-24 px-5 py-3 font-medium">Rank</th>
              <th scope="col" className="min-w-64 px-5 py-3 font-medium">Team</th>
              <th scope="col" className="px-5 py-3 font-medium">W</th>
              <th scope="col" className="px-5 py-3 font-medium">L</th>
              <th scope="col" className="px-5 py-3 font-medium">Win %</th>
              <th scope="col" className="px-5 py-3 font-medium">Home</th>
              <th scope="col" className="px-5 py-3 font-medium">Away</th>
              <th scope="col" className="px-5 py-3 font-medium">Last 10</th>
              <th scope="col" className="px-5 py-3 font-medium">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {teams.map((team) => (
              <tr key={team.teamId} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="font-display text-lg font-semibold text-text-primary">#{team.conferenceRank}</div>
                  <span className="text-xs text-text-secondary">{playoffStatus(team.conferenceRank)}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-text-primary">
                    {team.teamCity} {team.teamName}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    {team.teamAbbreviation || 'NBA'} - {team.division}
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary">{team.wins}</td>
                <td className="whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-secondary">{team.losses}</td>
                <td className="whitespace-nowrap px-5 py-4 font-display tabular-nums text-text-primary">
                  {formatWinPct(team.winPct)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">{team.homeRecord}</td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">{team.awayRecord}</td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">{team.lastTen}</td>
                <td className="whitespace-nowrap px-5 py-4 text-text-secondary">{team.streak || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-rule px-5 py-3 text-xs text-text-secondary">
        Seeds 1-6 make the playoffs directly; seeds 7-10 enter the play-in tournament.
      </p>
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
      <PageHero
        eyebrow="Standings"
        title="NBA Standings"
        description="Real regular-season conference standings delivered through Node with PostgreSQL cache."
        tags={['Powered by API-Sports']}
        right={
          <HeroStatLedger
            items={[
              { value: String(standings.length), label: 'Teams' },
              { value: season, label: 'Season' },
              { value: conference === 'all' ? 'All' : conference, label: 'Conference' },
            ]}
          />
        }
      />
      <div className="mt-4">
        <DataModeBadge />
      </div>

      <div className="mt-8">
        <ChampionSummary season={season} />
        <PlayoffBracket season={season} />
      </div>

      <div className="mt-8 border-t border-rule bg-ink-900 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <SelectFilter id="standings-season" label="Season" options={seasonOptions} value={season} onChange={setSeason} />
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
        <div className="mt-8 flex min-h-64 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading real standings
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">
                Live standings are temporarily unavailable.
              </h2>
              <p className="mt-1 text-text-secondary">
                NBA Insight can continue with demo or cached data depending on the selected data mode.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && filteredStandings.length === 0 ? (
        <div className="mt-8 border border-rule bg-ink-900 p-8 text-center">
          <Table2 className="mx-auto size-8 text-text-secondary" aria-hidden="true" />
          <h2 className="mt-5 font-display text-xl font-semibold text-text-primary">No standings found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
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
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 className="size-4 text-live-cyan" aria-hidden="true" />
            Standings loaded from API-Sports through the NBA Insight backend.
          </div>
        </div>
      ) : null}
    </section>
  );
}
