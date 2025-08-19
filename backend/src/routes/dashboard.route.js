// routes/dashboard.routes.js
import { Router } from 'express';
import { getDashboardStats, getSupplierDashboard } from '../controllers/dashboard.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/roleCheck.middleware.js';

const router = Router();

// Admin Dashboard Stats
// GET /api/admin/dashboard/stats
router
  .route('/admin')
  .get(verifyJWT, checkRole("admin"), getDashboardStats);

router
  .route('/supplier')
  .get(verifyJWT, checkRole("supplier"), getSupplierDashboard);


export default router;