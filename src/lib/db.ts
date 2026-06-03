import { config } from "dotenv";
// Load environment variables from .env at the project root
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Debug: verify that DATABASE_URL is loaded
if (process.env.DATABASE_URL) {
  console.log("🟢 DATABASE_URL loaded");
} else {
  console.error("🔴 DATABASE_URL NOT FOUND");
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.");
  throw new Error("Database connection string missing");
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === "production") {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    // Use PrismaPg adapter also in development for consistency
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = globalThis.prisma ?? new PrismaClient({ adapter });
    globalThis.prisma = prisma;
  }
} catch (initError) {
  console.error("Failed to initialize PrismaClient:", initError);
  throw initError;
}

export const db = prisma;
