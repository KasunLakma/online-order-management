import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';

/**
 * Create a new user (ADMIN or MANAGER)
 * POST /api/users
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, roleName } = req.body;

    if (!name || !email || !password || !roleName) {
      res.status(400).json({ error: 'Name, email, password, and roleName are required.' });
      return;
    }

    // Check if roleName is valid
    if (roleName !== 'ADMIN' && roleName !== 'MANAGER') {
      res.status(400).json({ error: 'Invalid roleName. Must be ADMIN or MANAGER.' });
      return;
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email is already in use.' });
      return;
    }

    // Fetch the role ID
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      res.status(400).json({ error: `Role '${roleName}' not found in system database.` });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error while creating user.' });
  }
};

/**
 * Get all users in the system (Admins and Managers)
 * GET /api/users
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: { id: 'asc' },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      message: 'Users fetched successfully.',
      users: formattedUsers,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error while fetching users.' });
  }
};
