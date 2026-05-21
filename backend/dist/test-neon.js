"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ws_1 = __importDefault(require("ws"));
const serverless_1 = require("@neondatabase/serverless");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const connectionString = process.env.DATABASE_URL;
console.log('DEBUG: connectionString =', connectionString);
// Pass the PoolConfig object instead of a Pool instance to the PrismaNeon factory
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
const prisma = new client_1.PrismaClient({ adapter });
async function run() {
    console.log('Running query...');
    const res = await prisma.$queryRaw `SELECT NOW()`;
    console.log('SUCCESS:', res);
}
run()
    .catch((err) => {
    console.error('FAILED:', err);
})
    .finally(async () => {
    await prisma.$disconnect();
});
