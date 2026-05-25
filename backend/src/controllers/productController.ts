import { Request, Response } from 'express';
import prisma from '../config/db';
import { Prisma } from '@prisma/client';

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, sku, price, quantity, image, status, categoryId } = req.body;

    // Validate required fields
    if (!name || !sku || price === undefined || categoryId === undefined) {
      res.status(400).json({ error: 'Name, SKU, price, and categoryId are required fields.' });
      return;
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!categoryExists) {
      res.status(400).json({ error: `Category with ID ${categoryId} does not exist.` });
      return;
    }

    // Check if SKU is unique
    const skuExists = await prisma.product.findUnique({
      where: { sku },
    });

    if (skuExists) {
      res.status(400).json({ error: `Product with SKU '${sku}' already exists.` });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        price: new Prisma.Decimal(price),
        quantity: quantity !== undefined ? Number(quantity) : 0,
        image: image || null,
        status: status || 'ACTIVE',
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      message: 'Product created successfully.',
      product,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error while creating product.' });
  }
};

/**
 * Get all products
 * GET /api/products
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      message: 'Products fetched successfully.',
      products,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error while fetching products.' });
  }
};

/**
 * Update an existing product
 * PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid product ID.' });
      return;
    }

    const { name, sku, price, quantity, image, status, categoryId } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    // If SKU is changed, verify it is unique
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      });
      if (skuExists) {
        res.status(400).json({ error: `Product with SKU '${sku}' already exists.` });
        return;
      }
    }

    // If categoryId is changed, verify category exists
    if (categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
      });
      if (!categoryExists) {
        res.status(400).json({ error: `Category with ID ${categoryId} does not exist.` });
        return;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        sku: sku !== undefined ? sku : existingProduct.sku,
        price: price !== undefined ? new Prisma.Decimal(price) : existingProduct.price,
        quantity: quantity !== undefined ? Number(quantity) : existingProduct.quantity,
        image: image !== undefined ? image : existingProduct.image,
        status: status !== undefined ? status : existingProduct.status,
        categoryId: categoryId !== undefined ? Number(categoryId) : existingProduct.categoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error while updating product.' });
  }
};

/**
 * Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid product ID.' });
      return;
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Product deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    // Handle foreign key constraint error
    if (error.code === 'P2003') {
      res.status(400).json({
        error: 'Cannot delete product as it is referenced by existing orders.',
      });
      return;
    }
    res.status(500).json({ error: 'Internal server error while deleting product.' });
  }
};
