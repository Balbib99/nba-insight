import { Router } from 'express';

import { getPlayerById, getPlayers } from '../controllers/players.controller.js';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);

export default router;
