"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_1 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("@prisma/client");
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Set the WebSocket constructor for Neon
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const connectionString = process.env.DATABASE_URL;
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
