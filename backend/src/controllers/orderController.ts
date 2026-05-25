import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../types/auth';
import { Prisma } from '@prisma/client';

/**
 * Create a new order (with transaction & stock deduction)
 * POST /api/orders
 */
export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      customerId,
      discount = 0,
      paymentMethod = 'CASH',
      orderSource = 'WEB',
      notes,
      orderItems
    } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User context is missing.' });
      return;
    }

    if (!customerId || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400).json({ error: 'customerId and orderItems (non-empty array) are required.' });
      return;
    }

    // Run transaction to ensure inventory safety and consistency
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify customer exists
      const customer = await tx.customer.findUnique({
        where: { id: Number(customerId) },
      });
      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found.`);
      }

      let subtotal = new Prisma.Decimal(0);
      const itemsToCreate = [];

      // 2. Validate products and stock
      for (const item of orderItems) {
        const prodId = Number(item.productId || item.product_id);
        const quantity = Number(item.qty || item.quantity);
        
        if (isNaN(prodId) || isNaN(quantity) || quantity <= 0) {
          throw new Error('Invalid product ID or quantity in order items.');
        }

        // Fetch product to get latest price and stock
        const product = await tx.product.findUnique({
          where: { id: prodId },
        });

        if (!product) {
          throw new Error(`Product with ID ${prodId} not found.`);
        }

        if (product.quantity < quantity) {
          throw new Error(`Insufficient stock for product '${product.name}'. Available: ${product.quantity}, requested: ${quantity}.`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: prodId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        // Calculate pricing
        const price = item.price !== undefined ? new Prisma.Decimal(item.price) : product.price;
        const totalItemPrice = price.mul(quantity);
        subtotal = subtotal.add(totalItemPrice);

        itemsToCreate.push({
          productId: prodId,
          qty: quantity,
          price,
          total: totalItemPrice,
        });
      }

      const discountDecimal = new Prisma.Decimal(discount);
      const totalAmount = subtotal.sub(discountDecimal);
      if (totalAmount.lessThan(0)) {
        throw new Error('Discount cannot be greater than the order subtotal.');
      }

      // Generate a unique invoice number
      const invoiceNo = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Create the Order and OrderItems
      const newOrder = await tx.order.create({
        data: {
          invoiceNo,
          customerId: Number(customerId),
          userId,
          status: 'PENDING',
          subtotal,
          discount: discountDecimal,
          total: totalAmount,
          paymentMethod,
          orderSource,
          notes: notes || null,
          orderItems: {
            create: itemsToCreate.map((item) => ({
              productId: item.productId,
              qty: item.qty,
              price: item.price,
              total: item.total,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          customer: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return newOrder;
    }, {
      maxWait: 15000,
      timeout: 20000
    });

    res.status(201).json({
      message: 'Order created successfully.',
      order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error.message || error);
    res.status(400).json({ error: error.message || 'Internal server error while creating order.' });
  }
};

/**
 * Get all orders
 * GET /api/orders
 */
export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    res.status(200).json({
      message: 'Orders fetched successfully.',
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error while fetching orders.' });
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid order ID.' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    res.status(200).json({
      message: 'Order fetched successfully.',
      order,
    });
  } catch (error: any) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal server error while fetching order.' });
  }
};
