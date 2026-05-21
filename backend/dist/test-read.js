"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
async function test() {
    console.log('Querying database...');
    try {
        const roles = await db_1.default.role.findMany();
        console.log('Roles found in database:', roles);
        const users = await db_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        console.log('Users found in database:', users);
    }
    catch (error) {
        console.error('Database query error:', error);
    }
    finally {
        await db_1.default.$disconnect();
    }
}
test();
