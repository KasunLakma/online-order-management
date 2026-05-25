import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

/**
 * POST /api/categories
 * Restrict to ADMIN only
 */
router.post('/', requireRole(['ADMIN']), createCategory);

/**
 * GET /api/categories
 * Restrict to ADMIN and MANAGER
 */
router.get('/', requireRole(['ADMIN', 'MANAGER']), getCategories);

/**
 * PUT /api/categories/:id
 * Restrict to ADMIN only
 */
router.put('/:id', requireRole(['ADMIN']), updateCategory);

/**
 * DELETE /api/categories/:id
 * Restrict to ADMIN only
 */
router.delete('/:id', requireRole(['ADMIN']), deleteCategory);

export default router;
