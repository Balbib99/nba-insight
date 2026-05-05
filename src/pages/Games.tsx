import { AlertCircle, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { GameCard } from '../components/GameCard';
import { getGamesByDate } from '../services/nbaService';
import type { Game } from '../data/gamesMock';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getOffsetDate(baseDate: string, offset: number): string {
  const date = new Date(`${baseDate}T12:00:00`);
  date.setDate(date.getDate() + offset);

  return formatDate(date);
}

function formatReadableDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

function DateShortcutButton({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: typeof CalendarDays;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
        isActive
          ? 'border-white bg-white text-zinc-950 shadow-lg shadow-black/20'
          : 'border-white/10 bg-zinc-950/70 text-zinc-300 hover:bg-white/10 hover:text-white'
      }`}
      onClick={onClick}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

export function Games() {
  const today = useMemo(() => formatDate(new Date()), []);
  const yesterday = useMemo(() => getOffsetDate(today, -1), [today]);
  const tomorrow = useMemo(() => getOffsetDate(today, 1), [today]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timeout = window.setTimeout(() => {
      async function loadGames() {
        try {
          setIsLoading(true);
          setError(null);

          const loadedGames = await getGamesByDate(selectedDate);

          if (isMounted) {
            setGames(loadedGames);
          }
        } catch {
          if (isMounted) {
            setGames([]);
            setError('Games could not be loaded. Please try another date.');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }

      void loadGames();
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeout);
    };
  }, [selectedDate]);

  const sortedGames = useMemo(
    () => [...games].sort((gameA, gameB) => gameA.time.localeCompare(gameB.time)),
    [games],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.24),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.95),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-red-300">Games</p>
                  <span className="inline-flex h-7 items-center rounded-lg border border-amber-300/30 bg-amber-400/10 px-2.5 text-xs font-semibold text-amber-100">
                    Demo Game Data
                  </span>
                </div>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  NBA Games
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Browse demo and historical mock matchups by date. This page is structured for a future
                  backend endpoint at <span className="font-semibold text-zinc-100">/api/games?date=YYYY-MM-DD</span>.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:w-full sm:max-w-md">
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-2xl font-semibold text-white">{sortedGames.length}</p>
                  <p className="mt-1 text-xs text-zinc-400">Games found</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3 text-center">
                  <p className="text-lg font-semibold text-white">{selectedDate}</p>
                  <p className="mt-1 text-xs text-zinc-400">Selected date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/20">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="games-date" className="mb-2 block text-sm font-medium text-zinc-300">
              Select date
            </label>
            <input
              id="games-date"
              type="date"
              className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 text-sm text-white outline-none transition focus:border-red-400/70 focus:ring-2 focus:ring-red-500/20 lg:max-w-xs"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <DateShortcutButton
              label="Yesterday"
              icon={ChevronLeft}
              isActive={selectedDate === yesterday}
              onClick={() => setSelectedDate(yesterday)}
            />
            <DateShortcutButton
              label="Today"
              icon={CalendarDays}
              isActive={selectedDate === today}
              onClick={() => setSelectedDate(today)}
            />
            <DateShortcutButton
              label="Tomorrow"
              icon={ChevronRight}
              isActive={selectedDate === tomorrow}
              onClick={() => setSelectedDate(tomorrow)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading games
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Unable to load games</h2>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && sortedGames.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
            <CalendarPlus className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">No games for this date</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            {formatReadableDate(selectedDate)} has no local demo games. Try today, yesterday or tomorrow.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && sortedGames.length > 0 ? (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-white">{formatReadableDate(selectedDate)}</h2>
            <p className="text-sm text-zinc-500">
              {sortedGames.length} {sortedGames.length === 1 ? 'game' : 'games'} loaded from local demo data
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {sortedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
