import { createContext } from 'react';
import type { Player } from '../types/player';

export interface FavoritesContextValue {
  favorites: Player[];
  addFavorite: (player: Player) => void;
  removeFavorite: (playerId: string) => void;
  isFavorite: (playerId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);
