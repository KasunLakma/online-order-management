import prisma from '../src/config/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // 1. Create/Upsert Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: { name: 'MANAGER' },
  });

  console.log('Roles seeded successfully:', { adminRole, managerRole });

  // 2. Hash default passwords
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const managerPasswordHash = await bcrypt.hash('manager123', 10);

  // 3. Create/Upsert Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: adminPasswordHash,
    },
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPasswordHash,
      roleId: adminRole.id,
    },
  });

  console.log('Admin user seeded:', {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: 'ADMIN',
  });

  // 4. Create/Upsert Manager User
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {
      password: managerPasswordHash,
    },
    create: {
      name: 'Manager User',
      email: 'manager@example.com',
      password: managerPasswordHash,
      roleId: managerRole.id,
    },
  });

  console.log('Manager user seeded:', {
    id: managerUser.id,
    name: managerUser.name,
    email: managerUser.email,
    role: 'MANAGER',
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
