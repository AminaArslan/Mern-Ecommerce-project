// routes/adminRoutes.js
import express from 'express';
import {protect } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';
import { getAdminStats } from '../controllers/admincontrollers.js';


const router = express.Router();

// Only admin can access stats
router.get('/stats', protect, isAdmin, getAdminStats);

export default router;
