import type { Request, Response } from 'express';

import {
  ApiBasketballServiceError,
  getApiBasketballStandings,
} from '../services/apiBasketballService.js';

export const getStandings = async (req: Request, res: Response) => {
  try {
    const season = typeof req.query.season === 'string' ? req.query.season : undefined;
    const seasonType =
      typeof req.query.season_type === 'string' ? req.query.season_type : undefined;
    const forceRefresh = req.query.forceRefresh === 'true';

    const standings = await getApiBasketballStandings({
      season,
      season_type: seasonType,
      forceRefresh,
    });

    return res.json(standings);
  } catch (error) {
    if (error instanceof ApiBasketballServiceError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unexpected standings data error' });
  }
};
