import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

/**
 * POST /api/users
 * Restrict to ADMIN only
 */
router.post('/', requireRole(['ADMIN']), createUser);

/**
 * GET /api/users
 * Restrict to ADMIN only
 */
router.get('/', requireRole(['ADMIN']), getUsers);

export default router;
