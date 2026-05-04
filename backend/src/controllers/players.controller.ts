import type { Request, Response } from 'express';

import { mockPlayers } from '../data/players.js';

export const getPlayers = (_req: Request, res: Response) => {
  res.json(mockPlayers);
};

export const getPlayerById = (req: Request, res: Response) => {
  const player = mockPlayers.find((item) => item.id === req.params.id);

  if (!player) {
    return res.status(404).json({ message: 'Player not found' });
  }

  return res.json(player);
};
