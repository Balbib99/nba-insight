import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addFavorite as addFavoriteRequest,
  getFavorites,
  getPlayerById,
  removeFavorite as removeFavoriteRequest,
} from '../services/nbaService';
import type { Player } from '../types/player';
import { FavoritesContext, type FavoritesContextValue } from './favoritesContextValue';

const demoUserId = 'demo-user';

function isPlayer(player: Player | undefined): player is Player {
  return Boolean(player);
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        setIsLoading(true);
        setError(null);

        const favoriteIds = await getFavorites(demoUserId);
        const loadedFavorites = (await Promise.all(favoriteIds.map((playerId) => getPlayerById(playerId)))).filter(
          isPlayer,
        );

        if (isMounted) {
          setFavorites(loadedFavorites);
        }
      } catch {
        if (isMounted) {
          setError('Favorites could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const addFavorite = useCallback(async (player: Player) => {
    try {
      setError(null);
      await addFavoriteRequest(demoUserId, player.id);

      setFavorites((currentFavorites) => {
        if (currentFavorites.some((favorite) => favorite.id === player.id)) {
          return currentFavorites;
        }

        return [...currentFavorites, player];
      });
    } catch {
      setError('Favorite could not be saved. Please try again later.');
    }
  }, []);

  const removeFavorite = useCallback(async (playerId: string) => {
    try {
      setError(null);
      await removeFavoriteRequest(demoUserId, playerId);
      setFavorites((currentFavorites) => currentFavorites.filter((favorite) => favorite.id !== playerId));
    } catch {
      setError('Favorite could not be removed. Please try again later.');
    }
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      error,
      addFavorite,
      removeFavorite,
      isFavorite: (playerId) => favorites.some((favorite) => favorite.id === playerId),
    }),
    [addFavorite, error, favorites, isLoading, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
