import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

/**
 * POST /api/orders
 * Restrict to ADMIN and MANAGER
 */
router.post('/', requireRole(['ADMIN', 'MANAGER']), createOrder);

/**
 * GET /api/orders
 * Restrict to ADMIN and MANAGER
 */
router.get('/', requireRole(['ADMIN', 'MANAGER']), getOrders);

/**
 * GET /api/orders/:id
 * Restrict to ADMIN and MANAGER
 */
router.get('/:id', requireRole(['ADMIN', 'MANAGER']), getOrderById);

/**
 * PUT /api/orders/:id/status
 * Restrict to ADMIN and MANAGER
 */
router.put('/:id/status', requireRole(['ADMIN', 'MANAGER']), updateOrderStatus);

export default router;
