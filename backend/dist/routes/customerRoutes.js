"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * POST /api/customers
 * Restrict to ADMIN and MANAGER
 */
router.post('/', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), customerController_1.createCustomer);
/**
 * GET /api/customers
 * Restrict to ADMIN and MANAGER
 */
router.get('/', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), customerController_1.getCustomers);
exports.default = router;
