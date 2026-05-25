"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
/**
 * Create a new user (ADMIN or MANAGER)
 * POST /api/users
 */
const createUser = async (req, res) => {
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
        const existingUser = await db_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({ error: 'Email is already in use.' });
            return;
        }
        // Fetch the role ID
        const role = await db_1.default.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            res.status(400).json({ error: `Role '${roleName}' not found in system database.` });
            return;
        }
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create the User
        const user = await db_1.default.user.create({
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
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error while creating user.' });
    }
};
exports.createUser = createUser;
/**
 * Get all users in the system (Admins and Managers)
 * GET /api/users
 */
const getUsers = async (req, res) => {
    try {
        const users = await db_1.default.user.findMany({
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
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error while fetching users.' });
    }
};
exports.getUsers = getUsers;
