import { AlertCircle, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PlayerCard } from '../components/PlayerCard';
import { PageHero } from '../components/PageHero';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/useFavorites';

export function Favorites() {
  const { isAuthenticated, isDemoMode } = useAuth();
  const { error, favorites, isLoading } = useFavorites();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Favorites"
        title="Saved Players"
        description="Keep track of players you want to revisit across profiles, comparisons and analytics."
        tags={[`${favorites.length} saved`]}
      />
      {isDemoMode ? (
        <p className="mt-5 text-sm text-text-secondary">Demo mode: favorites are stored locally in this browser.</p>
      ) : null}
      {isAuthenticated ? (
        <p className="mt-5 text-sm text-text-secondary">Signed in: favorites are saved to your account.</p>
      ) : null}

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading favorites
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">Unable to sync favorites</h2>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && favorites.length === 0 ? (
        <div className="mt-8 border border-rule bg-ink-900 p-8 text-center">
          <Heart className="mx-auto size-8 text-text-secondary" aria-hidden="true" />
          <h2 className="mt-5 font-display text-xl font-semibold text-text-primary">No favorites saved</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Save players from player cards, profiles or comparisons and they will stay here after refresh.
          </p>
          <Link
            to="/players"
            className="mt-5 inline-flex h-10 items-center justify-center bg-score-orange px-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
          >
            Browse players
          </Link>
        </div>
      ) : null}

      {!isLoading && favorites.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
