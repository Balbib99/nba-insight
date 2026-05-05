import { Router } from 'express';

import { getStandings } from '../controllers/standingsController.js';

const router = Router();

router.get('/', getStandings);

export default router;
