import type { Request, Response } from 'express';

import { mockPlayers } from '../data/players.js';
import { pool } from '../db/pool.js';

interface FavoriteRow {
  player_id: string;
}

function playerExists(playerId: string): boolean {
  return mockPlayers.some((player) => player.id === playerId);
}

async function getFavoriteIds(userId: string): Promise<string[]> {
  const result = await pool.query<FavoriteRow>(
    'SELECT player_id FROM favorites WHERE user_id = $1 ORDER BY created_at ASC, id ASC',
    [userId],
  );

  return result.rows.map((row) => row.player_id);
}

function getAuthenticatedUserId(req: Request): number | undefined {
  return req.auth?.userId;
}

export const getAuthenticatedFavorites = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    return res.json(await getFavoriteIds(String(userId)));
  } catch {
    return res.status(500).json({ message: 'Favorites could not be loaded' });
  }
};

export const addAuthenticatedFavorite = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { playerId } = req.body as { playerId?: string };

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!playerId) {
    return res.status(400).json({ message: 'Player id is required' });
  }

  if (!playerExists(playerId)) {
    return res.status(404).json({ message: 'Player not found' });
  }

  try {
    const result = await pool.query<FavoriteRow>(
      `INSERT INTO favorites (user_id, player_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, player_id) DO NOTHING
       RETURNING player_id`,
      [userId, playerId],
    );
    const favorites = await getFavoriteIds(String(userId));

    return res.status(result.rowCount === 0 ? 200 : 201).json(favorites);
  } catch {
    return res.status(500).json({ message: 'Favorite could not be saved' });
  }
};

export const removeAuthenticatedFavorite = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { playerId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!playerId) {
    return res.status(400).json({ message: 'Player id is required' });
  }

  try {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND player_id = $2', [userId, playerId]);

    return res.json(await getFavoriteIds(String(userId)));
  } catch {
    return res.status(500).json({ message: 'Favorite could not be removed' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required' });
  }

  try {
    return res.json(await getFavoriteIds(userId));
  } catch {
    return res.status(500).json({ message: 'Favorites could not be loaded' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
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

  try {
    const result = await pool.query<FavoriteRow>(
      `INSERT INTO favorites (user_id, player_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, player_id) DO NOTHING
       RETURNING player_id`,
      [userId, playerId],
    );
    const favorites = await getFavoriteIds(userId);

    return res.status(result.rowCount === 0 ? 200 : 201).json(favorites);
  } catch {
    return res.status(500).json({ message: 'Favorite could not be saved' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  const { playerId, userId } = req.params;

  if (!userId || !playerId) {
    return res.status(400).json({ message: 'User id and player id are required' });
  }

  try {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND player_id = $2', [userId, playerId]);

    return res.json(await getFavoriteIds(userId));
  } catch {
    return res.status(500).json({ message: 'Favorite could not be removed' });
  }
};
