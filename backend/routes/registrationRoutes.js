import express from 'express';
import {
  getRegistrations,
  getRegistration,
  createRegistration,
  updateRegistration,
  updatePaymentStatus,
  deleteRegistration
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getRegistrations)
  .post(protect, createRegistration);

router.route('/:id')
  .get(protect, getRegistration)
  .put(protect, updateRegistration)
  .delete(protect, authorize('admin'), deleteRegistration);

router.route('/:id/payment')
  .put(protect, authorize('admin'), updatePaymentStatus);

export default router;
