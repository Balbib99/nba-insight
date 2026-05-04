import { AlertCircle, Heart, Loader2, Trash2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/useFavorites';

export function Favorites() {
  const { error, favorites, isLoading, removeFavorite } = useFavorites();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.26),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.96),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-red-300">Favorites</p>
                <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  Saved Players
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Keep track of players you want to revisit across profiles, comparisons and analytics.
                </p>
              </div>
              <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-sm font-medium text-zinc-300">
                {favorites.length} saved
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading favorites
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Unable to sync favorites</h2>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && favorites.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
            <Heart className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">No favorites saved</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Save players from player cards, profiles or comparisons and they will stay here after refresh.
          </p>
          <Link
            to="/players"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Browse players
          </Link>
        </div>
      ) : null}

      {!isLoading && favorites.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((player) => (
            <article
              key={player.id}
              className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-lg shadow-black/20 transition hover:border-red-400/50 hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <Link to={`/players/${player.id}`} className="min-w-0 focus:outline-none focus:ring-2 focus:ring-red-500/40">
                  <p className="text-sm font-medium text-red-300">{player.teamName}</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">{player.fullName}</h2>
                </Link>
                <button
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:border-red-400/50 hover:bg-red-500/15 hover:text-red-200"
                  type="button"
                  aria-label={`Remove ${player.fullName} from favorites`}
                  title="Remove favorite"
                  onClick={() => {
                    void removeFavorite(player.id);
                  }}
                >
                  <Trash2 className="size-5" aria-hidden="true" />
                </button>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <dt className="text-zinc-500">Position</dt>
                  <dd className="mt-1 font-medium text-zinc-100">{player.position}</dd>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <dt className="text-zinc-500">Age</dt>
                  <dd className="mt-1 font-medium text-zinc-100">{player.age}</dd>
                </div>
              </dl>
              <Link
                to={`/players/${player.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                <UserRound className="size-4" aria-hidden="true" />
                View player profile
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
