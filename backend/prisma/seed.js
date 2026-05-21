"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../src/config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    console.log('Seeding database...');
    // 1. Create/Upsert Roles
    const adminRole = await db_1.default.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN' },
    });
    const managerRole = await db_1.default.role.upsert({
        where: { name: 'MANAGER' },
        update: {},
        create: { name: 'MANAGER' },
    });
    console.log('Roles seeded:', { adminRole, managerRole });
    // 2. Hash default admin password
    const defaultPassword = 'admin123';
    const hashedPassword = await bcryptjs_1.default.hash(defaultPassword, 10);
    // 3. Create/Upsert Admin User
    const adminUser = await db_1.default.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: hashedPassword, // Reset to default password if re-run
        },
        create: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            roleId: adminRole.id,
        },
    });
    console.log('Admin user seeded:', {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
    });
    console.log('Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await db_1.default.$disconnect();
});
