"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = exports.createCustomer = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * Create a new customer
 * POST /api/customers
 */
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, mobile1, mobile2, address, city, notes } = req.body;
        const finalMobile1 = phone || mobile1;
        // Validate inputs
        if (!name || !finalMobile1) {
            res.status(400).json({ error: 'Name and phone (or mobile1) number are required.' });
            return;
        }
        const customer = await db_1.default.customer.create({
            data: {
                name,
                email: email || null,
                mobile1: finalMobile1,
                mobile2: mobile2 || null,
                address: address || null,
                city: city || null,
                notes: notes || null,
            },
        });
        res.status(201).json({
            message: 'Customer created successfully.',
            customer,
        });
    }
    catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Internal server error while creating customer.' });
    }
};
exports.createCustomer = createCustomer;
/**
 * Get all customers
 * GET /api/customers
 */
const getCustomers = async (req, res) => {
    try {
        const customers = await db_1.default.customer.findMany({
            orderBy: { id: 'asc' },
        });
        res.status(200).json({
            message: 'Customers fetched successfully.',
            customers,
        });
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error while fetching customers.' });
    }
};
exports.getCustomers = getCustomers;
