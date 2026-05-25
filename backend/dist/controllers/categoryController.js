"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * Create a new category
 * POST /api/categories
 */
const createCategory = async (req, res) => {
    try {
        const { name, status } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Category name is required.' });
            return;
        }
        const category = await db_1.default.category.create({
            data: {
                name,
                status: status || 'ACTIVE',
            },
        });
        res.status(201).json({
            message: 'Category created successfully.',
            category,
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error while creating category.' });
    }
};
exports.createCategory = createCategory;
/**
 * Get all categories
 * GET /api/categories
 */
const getCategories = async (req, res) => {
    try {
        const categories = await db_1.default.category.findMany({
            orderBy: { id: 'asc' },
        });
        res.status(200).json({
            message: 'Categories fetched successfully.',
            categories,
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error while fetching categories.' });
    }
};
exports.getCategories = getCategories;
/**
 * Update a category
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid category ID.' });
            return;
        }
        const { name, status } = req.body;
        // Check if category exists
        const existingCategory = await db_1.default.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            res.status(404).json({ error: 'Category not found.' });
            return;
        }
        const updatedCategory = await db_1.default.category.update({
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
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error while updating category.' });
    }
};
exports.updateCategory = updateCategory;
/**
 * Delete a category
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid category ID.' });
            return;
        }
        // Check if category exists
        const existingCategory = await db_1.default.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            res.status(404).json({ error: 'Category not found.' });
            return;
        }
        // Attempt deletion
        await db_1.default.category.delete({
            where: { id },
        });
        res.status(200).json({
            message: 'Category deleted successfully.',
        });
    }
    catch (error) {
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
exports.deleteCategory = deleteCategory;
