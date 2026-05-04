import { Router } from 'express';

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../controllers/favoritesController.js';

const router = Router();

router.get('/:userId', getFavorites);
router.post('/:userId', addFavorite);
router.delete('/:userId/:playerId', removeFavorite);

export default router;
