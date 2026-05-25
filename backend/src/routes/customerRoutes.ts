import { Router } from 'express';
import { createCustomer, getCustomers } from '../controllers/customerController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

/**
 * POST /api/customers
 * Restrict to ADMIN and MANAGER
 */
router.post('/', requireRole(['ADMIN', 'MANAGER']), createCustomer);

/**
 * GET /api/customers
 * Restrict to ADMIN and MANAGER
 */
router.get('/', requireRole(['ADMIN', 'MANAGER']), getCustomers);

export default router;
