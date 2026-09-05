import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '../context/useFavorites';
import type { Player } from '../types/player';

interface FavoriteButtonProps {
  player: Player;
  variant?: 'icon' | 'full';
}

export function FavoriteButton({ player, variant = 'icon' }: FavoriteButtonProps) {
  const { addFavorite, isFavorite, isLoading, removeFavorite } = useFavorites();
  const [isMutating, setIsMutating] = useState(false);
  const active = isFavorite(player.id);

  async function toggleFavorite() {
    try {
      setIsMutating(true);

      if (active) {
        await removeFavorite(player.id);
        return;
      }

      await addFavorite(player);
    } finally {
      setIsMutating(false);
    }
  }

  const isDisabled = isLoading || isMutating;

  if (variant === 'full') {
    return (
      <button
        className={`inline-flex h-10 items-center justify-center gap-2 border px-4 font-body text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60 ${
          active
            ? 'border-score-orange/50 bg-score-orange/10 text-score-orange hover:bg-score-orange/15'
            : 'border-rule text-text-secondary hover:text-text-primary'
        }`}
        type="button"
        disabled={isDisabled}
        aria-pressed={active}
        onClick={() => {
          void toggleFavorite();
        }}
      >
        <Heart className={`size-4 ${active ? 'fill-current' : ''}`} aria-hidden="true" />
        {isMutating ? 'Saving...' : active ? 'Saved' : 'Save player'}
      </button>
    );
  }

  return (
    <button
      className={`flex size-10 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60 ${
        active
          ? 'border-score-orange/50 bg-score-orange/10 text-score-orange hover:bg-score-orange/15'
          : 'border-rule text-text-secondary hover:text-text-primary'
      }`}
      type="button"
      disabled={isDisabled}
      aria-pressed={active}
      aria-label={active ? `Remove ${player.fullName} from favorites` : `Add ${player.fullName} to favorites`}
      title={isMutating ? 'Saving favorite' : active ? 'Remove favorite' : 'Add favorite'}
      onClick={() => {
        void toggleFavorite();
      }}
    >
      <Heart className={`size-5 ${active ? 'fill-current' : ''}`} aria-hidden="true" />
    </button>
  );
}
