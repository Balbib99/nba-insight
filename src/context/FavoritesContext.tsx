import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  addBackendFavorite,
  addDemoFavorite,
  getBackendFavorites,
  getDemoFavorites,
  removeBackendFavorite,
  removeDemoFavorite,
} from '../services/favoritesService';
import { getPlayerById } from '../services/nbaService';
import type { Player } from '../types/player';
import { FavoritesContext, type FavoritesContextValue } from './favoritesContextValue';

function isPlayer(player: Player | undefined): player is Player {
  return Boolean(player);
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { authMode, token } = useAuth();
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        setIsLoading(true);
        setError(null);

        const favoriteIds =
          authMode === 'authenticated' && token
            ? await getBackendFavorites(token)
            : authMode === 'demo'
              ? getDemoFavorites()
              : [];
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
  }, [authMode, token]);

  const addFavorite = useCallback(async (player: Player) => {
    let previousFavorites: Player[] = [];

    try {
      setError(null);

      setFavorites((currentFavorites) => {
        previousFavorites = currentFavorites;

        if (currentFavorites.some((favorite) => favorite.id === player.id)) {
          return currentFavorites;
        }

        return [...currentFavorites, player];
      });

      if (authMode === 'authenticated') {
        if (!token) {
          throw new Error('Missing auth token');
        }

        await addBackendFavorite(token, player.id);
      } else if (authMode === 'demo') {
        addDemoFavorite(player.id);
      } else {
        setFavorites(previousFavorites);
        return;
      }
    } catch {
      setFavorites(previousFavorites);
      setError('Favorite could not be saved. Please try again later.');
    }
  }, [authMode, token]);

  const removeFavorite = useCallback(async (playerId: string) => {
    let previousFavorites: Player[] = [];

    try {
      setError(null);

      setFavorites((currentFavorites) => {
        previousFavorites = currentFavorites;

        return currentFavorites.filter((favorite) => favorite.id !== playerId);
      });

      if (authMode === 'authenticated') {
        if (!token) {
          throw new Error('Missing auth token');
        }

        await removeBackendFavorite(token, playerId);
      } else if (authMode === 'demo') {
        removeDemoFavorite(playerId);
      } else {
        setFavorites(previousFavorites);
        return;
      }
    } catch {
      setFavorites(previousFavorites);
      setError('Favorite could not be removed. Please try again later.');
    }
  }, [authMode, token]);

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
