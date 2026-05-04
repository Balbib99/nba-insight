import type { Request, Response } from 'express';

import { mockStats } from '../data/playerStats.js';

export const getPlayerStats = (_req: Request, res: Response) => {
  res.json(mockStats);
};

export const getPlayerStatsById = (req: Request, res: Response) => {
  const stats = mockStats.find((item) => item.playerId === req.params.id);

  if (!stats) {
    return res.status(404).json({ message: 'Player stats not found' });
  }

  return res.json(stats);
};
