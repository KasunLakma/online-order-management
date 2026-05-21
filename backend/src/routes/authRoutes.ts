import { Router, Response } from 'express';
import { login, logout } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

/**
 * Public Route: Login
 * POST /api/auth/login
 */
router.post('/login', login);

/**
 * Public Route: Logout boilerplate
 * POST /api/auth/logout
 */
router.post('/logout', logout);

/**
 * Protected Route: Get authenticated user profile (useful for testing middleware)
 * GET /api/auth/profile
 */
router.get('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    message: 'Profile details fetched successfully.',
    user: req.user,
  });
});

export default router;
