import { ArrowRightLeft, CalendarClock, Crown, Medal, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataModeBadge } from '../components/DataModeBadge';
import { PageHero } from '../components/PageHero';
import { SelectFilter, type SelectOption } from '../components/SelectFilter';
import { playoffBrackets, type PlayoffSeries } from '../data/playoffBrackets';
import { seasonChampions } from '../data/seasonChampions';
import { teams } from '../data/teams';

type SeasonOption = '2024-25' | '2023-24' | '2025-26';
type Conference = 'East' | 'West';

const seasonOptions: SelectOption[] = [
  { label: '2024-25', value: '2024-25' },
  { label: '2023-24', value: '2023-24' },
  { label: '2025-26', value: '2025-26' },
];

const roundLabels: Record<PlayoffSeries['round'], string> = {
  'First Round': 'Round 1',
  'Conference Semifinals': 'Semifinals',
  'Conference Finals': 'Conference Finals',
  'NBA Finals': 'NBA Finals',
};

const conferenceLabels: Record<Conference, string> = {
  East: 'Eastern Conference',
  West: 'Western Conference',
};

function getTeamInfo(teamName: string) {
  return teams.find((team) => team.fullName === teamName);
}

function parseSeriesResult(result: string) {
  const [winnerScore = '4', loserScore = '0'] = result.split('-');

  return {
    winnerScore,
    loserScore,
  };
}

function SeriesTeamRow({ teamName, score, isWinner }: { teamName: string; score: string; isWinner: boolean }) {
  const team = getTeamInfo(teamName);

  return (
    <div className="flex items-center gap-3 py-2">
      <span className={`font-display text-lg font-bold ${isWinner ? 'text-text-primary' : 'text-text-secondary'}`}>
        {team?.abbreviation ?? teamName.slice(0, 3).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isWinner ? 'text-text-primary' : 'text-text-secondary'}`}>
          {teamName}
        </p>
        {isWinner ? <p className="mt-0.5 text-xs text-live-cyan">Advanced</p> : null}
      </div>
      <span
        className={`font-display text-xl font-bold tabular-nums ${isWinner ? 'text-score-orange' : 'text-text-secondary'}`}
      >
        {score}
      </span>
    </div>
  );
}

function SeriesCard({ series }: { series: PlayoffSeries }) {
  const { winnerScore, loserScore } = parseSeriesResult(series.result);

  return (
    <article className="border-t border-rule bg-ink-950 px-3">
      <SeriesTeamRow teamName={series.winner} score={winnerScore} isWinner />
      <div className="h-px bg-rule" />
      <SeriesTeamRow teamName={series.loser} score={loserScore} isWinner={false} />
    </article>
  );
}

function ConferenceBracket({ conference, series }: { conference: Conference; series: PlayoffSeries[] }) {
  const rounds: PlayoffSeries['round'][] = ['First Round', 'Conference Semifinals', 'Conference Finals'];

  return (
    <section className="border-t border-rule bg-ink-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-secondary">{conferenceLabels[conference]}</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-text-primary">{conference} path</h2>
        </div>
        <span className="border border-rule px-3 py-1 text-xs font-medium text-text-secondary">
          {series.length} series
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="grid min-w-[840px] grid-cols-3 divide-x divide-rule">
          {rounds.map((round) => {
            const roundSeries = series.filter((item) => item.round === round);

            return (
              <div key={round} className="px-4 first:pl-0 last:pr-0">
                <div className="border-b border-rule pb-2">
                  <h3 className="text-sm font-medium text-text-primary">{roundLabels[round]}</h3>
                  <p className="mt-0.5 text-xs text-text-secondary">{roundSeries.length} matchups</p>
                </div>
                {roundSeries.map((item) => (
                  <SeriesCard key={`${item.round}-${item.winner}-${item.loser}`} series={item} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalsPanel({ finals }: { finals: PlayoffSeries }) {
  return (
    <section className="border-t border-rule bg-ink-900 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Crown className="size-4 text-score-orange" aria-hidden="true" />
            NBA Finals
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold text-text-primary">{finals.winner} win the title</h2>
          <p className="mt-2 text-sm text-text-secondary">
            {finals.winner} defeated {finals.loser} in a {finals.result} series.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <SeriesCard series={finals} />
        </div>
      </div>
    </section>
  );
}

function EmptyPlayoffsState({ season }: { season: string }) {
  return (
    <section className="mt-8 border border-rule bg-ink-900 p-8 sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <CalendarClock className="mx-auto size-8 text-text-secondary" aria-hidden="true" />
        <h2 className="mt-6 font-display text-3xl font-bold text-text-primary">Playoffs not started yet</h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {season} playoff results will appear here once the postseason is complete. The page is ready for
          historical data without using external APIs.
        </p>
      </div>
    </section>
  );
}

function PlayoffBracket({ series }: { series: PlayoffSeries[] }) {
  const eastSeries = series.filter((item) => item.conference === 'East');
  const westSeries = series.filter((item) => item.conference === 'West');
  const finals = series.find((item) => item.round === 'NBA Finals');

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-8 xl:grid-cols-2">
        <ConferenceBracket conference="East" series={eastSeries} />
        <ConferenceBracket conference="West" series={westSeries} />
      </div>
      {finals ? <FinalsPanel finals={finals} /> : null}
    </div>
  );
}

export function Playoffs() {
  const [season, setSeason] = useState<SeasonOption>('2024-25');

  const champion = useMemo(
    () => seasonChampions.find((seasonChampion) => seasonChampion.season === season),
    [season],
  );
  const bracket = useMemo(
    () => playoffBrackets.find((playoffBracket) => playoffBracket.season === season),
    [season],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Playoffs"
        title={`${season} Playoffs`}
        description="Explore the full postseason path by conference, series result, champion and Finals MVP without calling any external service."
        tags={['Historical local data']}
        right={
          <SelectFilter
            id="playoffs-season"
            label="Season"
            options={seasonOptions}
            value={season}
            onChange={(value) => setSeason(value as SeasonOption)}
          />
        }
      />
      <div className="mt-4">
        <DataModeBadge mode="mock" />
      </div>

      {champion ? (
        <div className="mt-8 grid divide-y divide-rule border border-rule lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <article className="p-5">
            <div className="flex items-center gap-3">
              <Trophy className="size-6 text-score-orange" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Champion</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-text-primary">{champion.champion}</h2>
              </div>
            </div>
          </article>
          <article className="p-5">
            <p className="text-xs text-text-secondary">Finals result</p>
            <p className="mt-2 font-display text-2xl font-bold text-text-primary">{champion.finalsResult}</p>
            <p className="mt-1 text-sm text-text-secondary">vs {champion.runnerUp}</p>
          </article>
          <article className="p-5">
            <p className="text-xs text-text-secondary">Finals MVP</p>
            <p className="mt-2 font-display text-2xl font-bold text-text-primary">{champion.finalsMvp}</p>
            <p className="mt-1 text-xs text-text-secondary">Awarded to the top performer of the NBA Finals.</p>
          </article>
          <Link
            to="/compare"
            className="flex items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-ledger-blue/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
          >
            <div>
              <p className="text-xs text-text-secondary">Next</p>
              <p className="mt-2 font-display text-lg font-semibold text-text-primary">Compare Finals players</p>
            </div>
            <ArrowRightLeft className="size-5 text-score-orange" aria-hidden="true" />
          </Link>
        </div>
      ) : null}

      {bracket ? <PlayoffBracket series={bracket.series} /> : <EmptyPlayoffsState season={season} />}

      <div className="mt-8 border-t border-rule pt-5">
        <div className="flex items-start gap-3 text-sm text-text-secondary">
          <Medal className="mt-0.5 size-5 shrink-0 text-score-orange" aria-hidden="true" />
          <p>
            Playoff data is stored locally in the project. Add new completed seasons to
            <span className="font-medium text-text-primary"> playoffBrackets.ts</span> and
            <span className="font-medium text-text-primary"> seasonChampions.ts</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
