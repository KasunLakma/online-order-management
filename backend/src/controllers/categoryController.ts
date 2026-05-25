import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Create a new category
 * POST /api/categories
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json({
      message: 'Category created successfully.',
      category,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error while creating category.' });
  }
};

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      message: 'Categories fetched successfully.',
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error while fetching categories.' });
  }
};

/**
 * Update a category
 * PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid category ID.' });
      return;
    }

    const { name, status } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingCategory.name,
        status: status !== undefined ? status : existingCategory.status,
      },
    });

    res.status(200).json({
      message: 'Category updated successfully.',
      category: updatedCategory,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error while updating category.' });
  }
};

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid category ID.' });
      return;
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    // Attempt deletion
    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Category deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    // Handle foreign key constraint error (code P2003)
    if (error.code === 'P2003') {
      res.status(400).json({
        error: 'Cannot delete category as it is associated with existing products.',
      });
      return;
    }
    res.status(500).json({ error: 'Internal server error while deleting category.' });
  }
};
