"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Public Route: Login
 * POST /api/auth/login
 */
router.post('/login', authController_1.login);
/**
 * Public Route: Logout boilerplate
 * POST /api/auth/logout
 */
router.post('/logout', authController_1.logout);
/**
 * Protected Route: Get authenticated user profile (useful for testing middleware)
 * GET /api/auth/profile
 */
router.get('/profile', authMiddleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Profile details fetched successfully.',
        user: req.user,
    });
});
exports.default = router;
