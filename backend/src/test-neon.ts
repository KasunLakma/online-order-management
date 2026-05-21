import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
console.log('DEBUG: connectionString =', connectionString);

// Pass the PoolConfig object instead of a Pool instance to the PrismaNeon factory
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('Running query...');
  const res = await prisma.$queryRaw`SELECT NOW()`;
  console.log('SUCCESS:', res);
}

run()
  .catch((err) => {
    console.error('FAILED:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
