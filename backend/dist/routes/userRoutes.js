"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * POST /api/users
 * Restrict to ADMIN only
 */
router.post('/', (0, authMiddleware_1.requireRole)(['ADMIN']), userController_1.createUser);
/**
 * GET /api/users
 * Restrict to ADMIN only
 */
router.get('/', (0, authMiddleware_1.requireRole)(['ADMIN']), userController_1.getUsers);
exports.default = router;
