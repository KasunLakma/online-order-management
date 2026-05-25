"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
/**
 * Create a new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        const { name, sku, price, quantity, image, status, categoryId } = req.body;
        // Validate required fields
        if (!name || !sku || price === undefined || categoryId === undefined) {
            res.status(400).json({ error: 'Name, SKU, price, and categoryId are required fields.' });
            return;
        }
        // Check if category exists
        const categoryExists = await db_1.default.category.findUnique({
            where: { id: Number(categoryId) },
        });
        if (!categoryExists) {
            res.status(400).json({ error: `Category with ID ${categoryId} does not exist.` });
            return;
        }
        // Check if SKU is unique
        const skuExists = await db_1.default.product.findUnique({
            where: { sku },
        });
        if (skuExists) {
            res.status(400).json({ error: `Product with SKU '${sku}' already exists.` });
            return;
        }
        const product = await db_1.default.product.create({
            data: {
                name,
                sku,
                price: new client_1.Prisma.Decimal(price),
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
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error while creating product.' });
    }
};
exports.createProduct = createProduct;
/**
 * Get all products
 * GET /api/products
 */
const getProducts = async (req, res) => {
    try {
        const products = await db_1.default.product.findMany({
            include: {
                category: true,
            },
            orderBy: { id: 'asc' },
        });
        res.status(200).json({
            message: 'Products fetched successfully.',
            products,
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error while fetching products.' });
    }
};
exports.getProducts = getProducts;
/**
 * Update an existing product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid product ID.' });
            return;
        }
        const { name, sku, price, quantity, image, status, categoryId } = req.body;
        // Check if product exists
        const existingProduct = await db_1.default.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            res.status(404).json({ error: 'Product not found.' });
            return;
        }
        // If SKU is changed, verify it is unique
        if (sku && sku !== existingProduct.sku) {
            const skuExists = await db_1.default.product.findUnique({
                where: { sku },
            });
            if (skuExists) {
                res.status(400).json({ error: `Product with SKU '${sku}' already exists.` });
                return;
            }
        }
        // If categoryId is changed, verify category exists
        if (categoryId !== undefined) {
            const categoryExists = await db_1.default.category.findUnique({
                where: { id: Number(categoryId) },
            });
            if (!categoryExists) {
                res.status(400).json({ error: `Category with ID ${categoryId} does not exist.` });
                return;
            }
        }
        const updatedProduct = await db_1.default.product.update({
            where: { id },
            data: {
                name: name !== undefined ? name : existingProduct.name,
                sku: sku !== undefined ? sku : existingProduct.sku,
                price: price !== undefined ? new client_1.Prisma.Decimal(price) : existingProduct.price,
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
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error while updating product.' });
    }
};
exports.updateProduct = updateProduct;
/**
 * Delete a product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid product ID.' });
            return;
        }
        // Check if product exists
        const existingProduct = await db_1.default.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            res.status(404).json({ error: 'Product not found.' });
            return;
        }
        await db_1.default.product.delete({
            where: { id },
        });
        res.status(200).json({
            message: 'Product deleted successfully.',
        });
    }
    catch (error) {
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
exports.deleteProduct = deleteProduct;
