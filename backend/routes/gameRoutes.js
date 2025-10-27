import express from 'express';
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/gameController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getGames)
  .post(protect, authorize('admin'), createGame);

router.route('/:id')
  .get(getGame)
  .put(protect, authorize('admin'), updateGame)
  .delete(protect, authorize('admin'), deleteGame);

export default router;
