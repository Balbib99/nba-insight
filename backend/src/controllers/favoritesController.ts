import type { Request, Response } from 'express';

import { favoritesByUserId } from '../data/favorites.js';
import { mockPlayers } from '../data/players.js';

function ensureUserFavorites(userId: string): string[] {
  favoritesByUserId[userId] ??= [];

  return favoritesByUserId[userId];
}

function playerExists(playerId: string): boolean {
  return mockPlayers.some((player) => player.id === playerId);
}

export const getFavorites = (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required' });
  }

  return res.json(ensureUserFavorites(userId));
};

export const addFavorite = (req: Request, res: Response) => {
  const { userId } = req.params;
  const { playerId } = req.body as { playerId?: string };

  if (!userId) {
    return res.status(400).json({ message: 'User id is required' });
  }

  if (!playerId) {
    return res.status(400).json({ message: 'Player id is required' });
  }

  if (!playerExists(playerId)) {
    return res.status(404).json({ message: 'Player not found' });
  }

  const favorites = ensureUserFavorites(userId);

  if (!favorites.includes(playerId)) {
    favorites.push(playerId);
  }

  return res.status(201).json(favorites);
};

export const removeFavorite = (req: Request, res: Response) => {
  const { playerId, userId } = req.params;

  if (!userId || !playerId) {
    return res.status(400).json({ message: 'User id and player id are required' });
  }

  const favorites = ensureUserFavorites(userId);
  favoritesByUserId[userId] = favorites.filter((favoritePlayerId) => favoritePlayerId !== playerId);

  return res.json(favoritesByUserId[userId]);
};
