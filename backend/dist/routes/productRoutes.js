"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * POST /api/products
 * Restrict to ADMIN only
 */
router.post('/', (0, authMiddleware_1.requireRole)(['ADMIN']), productController_1.createProduct);
/**
 * GET /api/products
 * Restrict to ADMIN and MANAGER
 */
router.get('/', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), productController_1.getProducts);
/**
 * PUT /api/products/:id
 * Restrict to ADMIN only
 */
router.put('/:id', (0, authMiddleware_1.requireRole)(['ADMIN']), productController_1.updateProduct);
/**
 * DELETE /api/products/:id
 * Restrict to ADMIN only
 */
router.delete('/:id', (0, authMiddleware_1.requireRole)(['ADMIN']), productController_1.deleteProduct);
exports.default = router;
