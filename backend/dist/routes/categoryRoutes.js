"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * POST /api/categories
 * Restrict to ADMIN only
 */
router.post('/', (0, authMiddleware_1.requireRole)(['ADMIN']), categoryController_1.createCategory);
/**
 * GET /api/categories
 * Restrict to ADMIN and MANAGER
 */
router.get('/', (0, authMiddleware_1.requireRole)(['ADMIN', 'MANAGER']), categoryController_1.getCategories);
/**
 * PUT /api/categories/:id
 * Restrict to ADMIN only
 */
router.put('/:id', (0, authMiddleware_1.requireRole)(['ADMIN']), categoryController_1.updateCategory);
/**
 * DELETE /api/categories/:id
 * Restrict to ADMIN only
 */
router.delete('/:id', (0, authMiddleware_1.requireRole)(['ADMIN']), categoryController_1.deleteCategory);
exports.default = router;
