import { Router } from 'express';

import {
  getPlayerStats,
  getPlayerStatsById,
} from '../controllers/playerStats.controller.js';

const router = Router();

router.get('/players', getPlayerStats);
router.get('/players/:id', getPlayerStatsById);

export default router;
