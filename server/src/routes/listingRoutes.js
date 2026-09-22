import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getListings);
router.get('/:id', getListingById);

// Admin only
router.post('/', requireAdmin, createListing);
router.put('/:id', requireAdmin, updateListing);
router.delete('/:id', requireAdmin, deleteListing);

export default router;