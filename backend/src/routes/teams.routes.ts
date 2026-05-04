import { Router } from 'express';

import { getTeamById, getTeams } from '../controllers/teams.controller.js';

const router = Router();

router.get('/', getTeams);
router.get('/:id', getTeamById);

export default router;
