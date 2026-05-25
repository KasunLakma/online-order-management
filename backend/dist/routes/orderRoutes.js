"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * POST /api/orders
 * Restrict to ADMIN and MANAGER
 */
router.post('/', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), orderController_1.createOrder);
/**
 * GET /api/orders
 * Restrict to ADMIN and MANAGER
 */
router.get('/', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), orderController_1.getOrders);
/**
 * GET /api/orders/:id
 * Restrict to ADMIN and MANAGER
 */
router.get('/:id', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), orderController_1.getOrderById);
/**
 * PUT /api/orders/:id/status
 * Restrict to ADMIN and MANAGER
 */
router.put('/:id/status', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), orderController_1.updateOrderStatus);
exports.default = router;
