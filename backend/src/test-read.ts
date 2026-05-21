import prisma from './config/db';

async function test() {
  console.log('Querying database...');
  try {
    const roles = await prisma.role.findMany();
    console.log('Roles found in database:', roles);
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    console.log('Users found in database:', users);
  } catch (error) {
    console.error('Database query error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
