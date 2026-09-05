import { AlertCircle, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataModeBadge } from '../components/DataModeBadge';
import { GameCard } from '../components/GameCard';
import { HeroStatLedger, PageHero } from '../components/PageHero';
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
      className={`inline-flex h-11 items-center justify-center gap-2 border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60 ${
        isActive ? 'border-score-orange text-text-primary' : 'border-rule text-text-secondary hover:text-text-primary'
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
            setError('Live games are currently unavailable. Showing demo data when fallback data exists.');
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
      <PageHero
        eyebrow="Games"
        title="NBA Games"
        description={
          <>
            Browse demo and historical mock matchups by date. This page is structured for a future backend endpoint
            at <code className="font-display text-sm text-text-primary">/api/games?date=YYYY-MM-DD</code>.
          </>
        }
        tags={['Demo Game Data']}
        right={
          <HeroStatLedger
            items={[
              { value: String(sortedGames.length), label: 'Games found' },
              { value: selectedDate, label: 'Selected date' },
            ]}
          />
        }
      />
      <div className="mt-4">
        <DataModeBadge />
      </div>

      <div className="mt-8 border-t border-rule bg-ink-900 p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="games-date" className="mb-2 block text-sm font-medium text-text-secondary">
              Select date
            </label>
            <input
              id="games-date"
              type="date"
              className="h-11 w-full border border-rule bg-ink-950 px-3 text-sm text-text-primary outline-none transition-colors focus:border-live-cyan/60 focus:ring-2 focus:ring-live-cyan/20 lg:max-w-xs"
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
        <div className="mt-8 flex min-h-64 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading games
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">Unable to load games</h2>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && sortedGames.length === 0 ? (
        <div className="mt-8 border border-rule bg-ink-900 p-8 text-center">
          <CalendarPlus className="mx-auto size-8 text-text-secondary" aria-hidden="true" />
          <h2 className="mt-5 font-display text-xl font-semibold text-text-primary">No games for this date</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            {formatReadableDate(selectedDate)} has no local demo games. Try today, yesterday or tomorrow.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && sortedGames.length > 0 ? (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-1 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-semibold text-text-primary">{formatReadableDate(selectedDate)}</h2>
            <p className="text-sm text-text-secondary">
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
