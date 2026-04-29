import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Player } from '../types/player';
import { FavoritesContext, type FavoritesContextValue } from './favoritesContextValue';

const storageKey = 'nba-insight:favorites';

function readFavoritesFromStorage(): Player[] {
  try {
    const storedFavorites = window.localStorage.getItem(storageKey);
    return storedFavorites ? (JSON.parse(storedFavorites) as Player[]) : [];
  } catch {
    return [];
  }
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Player[]>(readFavoritesFromStorage);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      addFavorite: (player) => {
        setFavorites((currentFavorites) => {
          if (currentFavorites.some((favorite) => favorite.id === player.id)) {
            return currentFavorites;
          }

          return [...currentFavorites, player];
        });
      },
      removeFavorite: (playerId) => {
        setFavorites((currentFavorites) => currentFavorites.filter((favorite) => favorite.id !== playerId));
      },
      isFavorite: (playerId) => favorites.some((favorite) => favorite.id === playerId),
    }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
