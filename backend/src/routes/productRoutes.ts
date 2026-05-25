import { Router } from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

/**
 * POST /api/products
 * Restrict to ADMIN only
 */
router.post('/', requireRole(['ADMIN']), createProduct);

/**
 * GET /api/products
 * Restrict to ADMIN and MANAGER
 */
router.get('/', requireRole(['ADMIN', 'MANAGER']), getProducts);

/**
 * PUT /api/products/:id
 * Restrict to ADMIN only
 */
router.put('/:id', requireRole(['ADMIN']), updateProduct);

/**
 * DELETE /api/products/:id
 * Restrict to ADMIN only
 */
router.delete('/:id', requireRole(['ADMIN']), deleteProduct);

export default router;
