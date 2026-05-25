import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Create a new customer
 * POST /api/customers
 */
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, mobile1, mobile2, address, city, notes } = req.body;
    const finalMobile1 = phone || mobile1;

    // Validate inputs
    if (!name || !finalMobile1) {
      res.status(400).json({ error: 'Name and phone (or mobile1) number are required.' });
      return;
    }

    const customer = await prisma.customer.create({
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
