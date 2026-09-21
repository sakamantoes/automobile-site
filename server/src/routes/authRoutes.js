import express from 'express';
import { login, me } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAdmin, me);

export default router;