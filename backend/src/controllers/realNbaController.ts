import type { Request, Response } from 'express';

import {
  getLeagueLeaders,
  getPlayerGameLog,
  getPythonServiceHealth,
  getStandings,
  getTeamDetails,
  PythonNbaServiceError,
  type RealNbaQueryParams,
} from '../services/pythonNbaService.js';

function queryParams(req: Request): RealNbaQueryParams {
  return {
    season: typeof req.query.season === 'string' ? req.query.season : undefined,
    stat: typeof req.query.stat === 'string' ? req.query.stat : undefined,
    season_type: typeof req.query.season_type === 'string' ? req.query.season_type : undefined,
  };
}

function handleError(error: unknown, res: Response) {
  if (error instanceof PythonNbaServiceError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Unexpected real NBA data error' });
}

export const getRealHealth = async (_req: Request, res: Response) => {
  try {
    return res.json(await getPythonServiceHealth());
  } catch (error) {
    return handleError(error, res);
  }
};

export const getRealLeagueLeaders = async (req: Request, res: Response) => {
  try {
    return res.json(await getLeagueLeaders(queryParams(req)));
  } catch (error) {
    return handleError(error, res);
  }
};

export const getRealPlayerGameLog = async (req: Request, res: Response) => {
  try {
    return res.json(await getPlayerGameLog(req.params.playerId, queryParams(req)));
  } catch (error) {
    return handleError(error, res);
  }
};

export const getRealTeamDetails = async (req: Request, res: Response) => {
  try {
    return res.json(await getTeamDetails(req.params.teamId));
  } catch (error) {
    return handleError(error, res);
  }
};

export const getRealStandings = async (req: Request, res: Response) => {
  try {
    return res.json(await getStandings(queryParams(req)));
  } catch (error) {
    return handleError(error, res);
  }
};
