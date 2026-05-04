import { createContext } from 'react';
import type { Player } from '../types/player';

export interface FavoritesContextValue {
  favorites: Player[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (player: Player) => Promise<void>;
  removeFavorite: (playerId: string) => Promise<void>;
  isFavorite: (playerId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);
