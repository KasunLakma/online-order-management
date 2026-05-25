import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Create a new customer
 * POST /api/customers
 */
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, address, notes } = req.body;

    // Validate inputs
    if (!name || !phone) {
      res.status(400).json({ error: 'Name and phone number are required.' });
      return;
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || null,
        mobile1: phone,
        address: address || null,
        notes: notes || null,
      },
    });

    res.status(201).json({
      message: 'Customer created successfully.',
      customer,
    });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error while creating customer.' });
  }
};

/**
 * Get all customers
 * GET /api/customers
 */
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      message: 'Customers fetched successfully.',
      customers,
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error while fetching customers.' });
  }
};
