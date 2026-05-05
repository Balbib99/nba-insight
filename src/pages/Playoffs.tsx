import { ArrowRightLeft, CalendarClock, Crown, Info, Medal, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataModeBadge } from '../components/DataModeBadge';
import { SelectFilter, type SelectOption } from '../components/SelectFilter';
import { playoffBrackets, type PlayoffSeries } from '../data/playoffBrackets';
import { seasonChampions } from '../data/seasonChampions';
import { teams } from '../data/teams';
import { useMemo, useState } from 'react';

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

const conferenceStyles: Record<Conference, { label: string; text: string; border: string; bg: string; chip: string }> = {
  East: {
    label: 'Eastern Conference',
    text: 'text-sky-100',
    border: 'border-sky-300/20',
    bg: 'bg-sky-500/10',
    chip: 'bg-sky-400/15 text-sky-100 border-sky-300/20',
  },
  West: {
    label: 'Western Conference',
    text: 'text-red-100',
    border: 'border-red-300/20',
    bg: 'bg-red-500/10',
    chip: 'bg-red-400/15 text-red-100 border-red-300/20',
  },
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

function TeamLogoMark({ teamName, isWinner }: { teamName: string; isWinner: boolean }) {
  const team = getTeamInfo(teamName);

  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
        isWinner
          ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'
          : 'border-white/10 bg-white/[0.04] text-zinc-400'
      }`}
    >
      {team?.abbreviation ?? teamName.slice(0, 3).toUpperCase()}
    </span>
  );
}

function SeriesTeamRow({ teamName, score, isWinner }: { teamName: string; score: string; isWinner: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
        isWinner ? 'bg-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <TeamLogoMark teamName={teamName} isWinner={isWinner} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${isWinner ? 'text-white' : 'text-zinc-400'}`}>{teamName}</p>
        {isWinner ? <p className="mt-0.5 text-xs text-emerald-200/80">Advanced</p> : null}
      </div>
      <span className={`text-xl font-bold tabular-nums ${isWinner ? 'text-white' : 'text-zinc-500'}`}>{score}</span>
    </div>
  );
}

function SeriesCard({ series, accent }: { series: PlayoffSeries; accent: Conference | 'Finals' }) {
  const { winnerScore, loserScore } = parseSeriesResult(series.result);
  const accentClass =
    accent === 'East'
      ? 'hover:border-sky-300/40'
      : accent === 'West'
        ? 'hover:border-red-300/40'
        : 'hover:border-amber-300/40';

  return (
    <article
      className={`group rounded-lg border border-white/10 bg-zinc-950/70 p-3 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-900/90 ${accentClass}`}
    >
      <SeriesTeamRow teamName={series.winner} score={winnerScore} isWinner />
      <div className="my-2 h-px bg-white/10" />
      <SeriesTeamRow teamName={series.loser} score={loserScore} isWinner={false} />
    </article>
  );
}

function ConferenceBracket({ conference, series }: { conference: Conference; series: PlayoffSeries[] }) {
  const styles = conferenceStyles[conference];
  const rounds: PlayoffSeries['round'][] = ['First Round', 'Conference Semifinals', 'Conference Finals'];

  return (
    <section className={`rounded-lg border ${styles.border} bg-zinc-900/80 p-5 shadow-xl shadow-black/20`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={`text-sm font-semibold ${styles.text}`}>{styles.label}</p>
          <h2 className="mt-1 text-2xl font-bold text-white">{conference} path</h2>
        </div>
        <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${styles.chip}`}>
          {series.length} series
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="grid min-w-[840px] grid-cols-[1.2fr_1fr_0.9fr] gap-4">
          {rounds.map((round) => {
            const roundSeries = series.filter((item) => item.round === round);

            return (
              <div key={round} className="space-y-3">
                <div className={`rounded-lg border ${styles.border} ${styles.bg} px-3 py-2`}>
                  <h3 className="text-sm font-semibold text-white">{roundLabels[round]}</h3>
                  <p className="mt-0.5 text-xs text-zinc-400">{roundSeries.length} matchups</p>
                </div>
                {roundSeries.map((item) => (
                  <SeriesCard key={`${item.round}-${item.winner}-${item.loser}`} series={item} accent={conference} />
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
    <section className="rounded-lg border border-amber-300/20 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
            <Crown className="size-4" aria-hidden="true" />
            NBA Finals
          </div>
          <h2 className="mt-2 text-3xl font-bold text-white">{finals.winner} win the title</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {finals.winner} defeated {finals.loser} in a {finals.result} series.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <SeriesCard series={finals} accent="Finals" />
        </div>
      </div>
    </section>
  );
}

function EmptyPlayoffsState({ season }: { season: string }) {
  return (
    <section className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/30">
      <div className="relative p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(220,38,38,0.20),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.16),_transparent_34%)]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300">
            <CalendarClock className="size-8" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Playoffs not started yet</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {season} playoff results will appear here once the postseason is complete. The page is ready for
            historical data without using external APIs.
          </p>
        </div>
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
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(220,38,38,0.22),_transparent_32%),linear-gradient(135deg,_rgba(39,39,42,0.95),_rgba(9,9,11,1)_66%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-red-300">Playoffs</p>
                  <span className="inline-flex h-7 items-center rounded-lg border border-white/10 bg-white/[0.05] px-2.5 text-xs font-semibold text-zinc-200">
                    Historical local data
                  </span>
                  <DataModeBadge mode="mock" />
                </div>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  {season} Playoffs
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Explore the full postseason path by conference, series result, champion and Finals MVP without
                  calling any external service.
                </p>
              </div>

              <div className="w-full lg:max-w-xs">
                <SelectFilter
                  id="playoffs-season"
                  label="Season"
                  options={seasonOptions}
                  value={season}
                  onChange={(value) => setSeason(value as SeasonOption)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {champion ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <article className="rounded-lg border border-amber-300/20 bg-amber-400/10 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-300/10 text-amber-100">
                <Trophy className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-100">Champion</p>
                <h2 className="mt-1 text-2xl font-bold text-white">{champion.champion}</h2>
              </div>
            </div>
          </article>
          <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5">
            <p className="text-xs font-semibold uppercase text-zinc-500">Finals result</p>
            <p className="mt-2 text-2xl font-bold text-white">{champion.finalsResult}</p>
            <p className="mt-1 text-sm text-zinc-400">vs {champion.runnerUp}</p>
          </article>
          <article className="group relative rounded-lg border border-white/10 bg-zinc-900/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-zinc-500">Finals MVP</p>
              <Info className="size-4 text-zinc-500" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{champion.finalsMvp}</p>
            <div className="pointer-events-none absolute right-4 top-12 z-10 hidden max-w-56 rounded-lg border border-white/10 bg-zinc-950 p-3 text-xs leading-5 text-zinc-300 shadow-xl group-hover:block">
              Awarded to the top performer of the NBA Finals.
            </div>
          </article>
          <Link
            to="/compare"
            className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-red-300/30 hover:bg-red-500/10"
          >
            <div>
              <p className="text-xs font-semibold uppercase text-zinc-500">Next</p>
              <p className="mt-2 text-lg font-semibold text-white">Compare Finals players</p>
            </div>
            <ArrowRightLeft className="size-5 text-red-300" aria-hidden="true" />
          </Link>
        </div>
      ) : null}

      {bracket ? <PlayoffBracket series={bracket.series} /> : <EmptyPlayoffsState season={season} />}

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start gap-3 text-sm text-zinc-400">
          <Medal className="mt-0.5 size-5 shrink-0 text-amber-200" aria-hidden="true" />
          <p>
            Playoff data is stored locally in the project. Add new completed seasons to
            <span className="font-semibold text-zinc-200"> playoffBrackets.ts</span> and
            <span className="font-semibold text-zinc-200"> seasonChampions.ts</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
