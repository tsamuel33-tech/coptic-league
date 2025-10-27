import express from 'express';
import {
  getLeagues,
  getLeague,
  createLeague,
  updateLeague,
  deleteLeague,
  getLeagueStandings
} from '../controllers/leagueController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getLeagues)
  .post(protect, authorize('admin'), createLeague);

router.route('/:id')
  .get(getLeague)
  .put(protect, authorize('admin'), updateLeague)
  .delete(protect, authorize('admin'), deleteLeague);

router.route('/:id/standings')
  .get(getLeagueStandings);

export default router;
