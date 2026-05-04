import { Heart } from 'lucide-react';
import { useFavorites } from '../context/useFavorites';
import type { Player } from '../types/player';

interface FavoriteButtonProps {
  player: Player;
  variant?: 'icon' | 'full';
}

export function FavoriteButton({ player, variant = 'icon' }: FavoriteButtonProps) {
  const { addFavorite, isFavorite, isLoading, removeFavorite } = useFavorites();
  const active = isFavorite(player.id);

  function toggleFavorite() {
    if (active) {
      void removeFavorite(player.id);
      return;
    }

    void addFavorite(player);
  }

  if (variant === 'full') {
    return (
      <button
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
          active
            ? 'border-red-400/50 bg-red-500/15 text-red-200 hover:bg-red-500/20'
            : 'border-white/10 bg-white/[0.06] text-zinc-200 hover:bg-white/10 hover:text-white'
        }`}
        type="button"
        disabled={isLoading}
        onClick={toggleFavorite}
      >
        <Heart className={`size-4 ${active ? 'fill-current' : ''}`} aria-hidden="true" />
        {active ? 'Saved' : 'Save player'}
      </button>
    );
  }

  return (
    <button
      className={`flex size-10 items-center justify-center rounded-lg border transition ${
        active
          ? 'border-red-400/50 bg-red-500/15 text-red-200 hover:bg-red-500/20'
          : 'border-white/10 bg-white/[0.06] text-zinc-300 hover:bg-white/10 hover:text-white'
      }`}
      type="button"
      disabled={isLoading}
      aria-label={active ? `Remove ${player.fullName} from favorites` : `Add ${player.fullName} to favorites`}
      title={active ? 'Remove favorite' : 'Add favorite'}
      onClick={toggleFavorite}
    >
      <Heart className={`size-5 ${active ? 'fill-current' : ''}`} aria-hidden="true" />
    </button>
  );
}
