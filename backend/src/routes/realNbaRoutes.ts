import { Router } from 'express';

import {
  getRealHealth,
  getRealLeagueLeaders,
  getRealPlayerGameLog,
  getRealStandings,
  getRealTeamDetails,
} from '../controllers/realNbaController.js';

const router = Router();

router.get('/health', getRealHealth);
router.get('/league-leaders', getRealLeagueLeaders);
router.get('/player-gamelog/:playerId', getRealPlayerGameLog);
router.get('/team-details/:teamId', getRealTeamDetails);
router.get('/standings', getRealStandings);

export default router;
