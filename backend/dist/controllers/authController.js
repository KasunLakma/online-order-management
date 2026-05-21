"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
/**
 * Handles user login
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate inputs
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }
        // Find user by email and include role information
        const user = await db_1.default.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }
        // Compare the password using bcrypt
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }
        // Sign JWT token containing user's ID and ROLE
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role.name,
        }, JWT_SECRET, { expiresIn: '24h' });
        // Return the token and user details
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            },
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error during login.' });
    }
};
exports.login = login;
/**
 * Handles user logout (boilerplate)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
    try {
        // JWT is stateless, client needs to delete the token from storage.
        // This endpoint acts as a boilerplate confirmation of logout.
        res.status(200).json({
            message: 'Logout successful. Please delete the token on the client side.',
        });
    }
    catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal server error during logout.' });
    }
};
exports.logout = logout;
