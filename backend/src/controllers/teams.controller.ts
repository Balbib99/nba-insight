import type { Request, Response } from 'express';

import { teams } from '../data/teams.js';

export const getTeams = (_req: Request, res: Response) => {
  res.json(teams);
};

export const getTeamById = (req: Request, res: Response) => {
  const team = teams.find((item) => item.id === req.params.id);

  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  return res.json(team);
};
