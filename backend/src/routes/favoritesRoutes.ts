import { Router } from 'express';

import {
  addAuthenticatedFavorite,
  addFavorite,
  getAuthenticatedFavorites,
  getFavorites,
  removeAuthenticatedFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAuthenticatedFavorites);
router.post('/', authMiddleware, addAuthenticatedFavorite);
router.delete('/:playerId', authMiddleware, removeAuthenticatedFavorite);

// Legacy/demo-only compatibility routes. The authenticated frontend must not use these.
router.get('/:userId', getFavorites);
router.post('/:userId', addFavorite);
router.delete('/:userId/:playerId', removeFavorite);

export default router;
