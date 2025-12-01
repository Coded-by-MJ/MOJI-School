import "dotenv/config";
import type { PrismaConfig } from "prisma";

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL!,
    // shadowDatabaseUrl: process.env.DATABASE_URL!,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;
