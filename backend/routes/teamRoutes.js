import express from 'express';
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  deleteTeam
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getTeams)
  .post(protect, authorize('coach', 'admin'), createTeam);

router.route('/:id')
  .get(getTeam)
  .put(protect, authorize('coach', 'admin'), updateTeam)
  .delete(protect, authorize('admin'), deleteTeam);

router.route('/:id/players')
  .post(protect, authorize('coach', 'admin'), addPlayerToTeam);

router.route('/:id/players/:playerId')
  .delete(protect, authorize('coach', 'admin'), removePlayerFromTeam);

export default router;
