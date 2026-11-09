
import { defineConfig } from 'prisma/config';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(root, '.env'),
  quiet: true,
});

// รองรับ SQLite ในเครื่อง และ Remote libSQL
const rawUrl =
  process.env.DATABASE_URL || 'file:./fitness.db';

const databaseUrl = rawUrl.startsWith('file:')
  ? 'file:' +
    path.resolve(root, 'prisma', rawUrl.slice(5))
  : rawUrl;

// Prisma configuration
export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  experimental: {
    adapter: true,
  },

  engine: 'js',

  adapter: async () =>
    new PrismaLibSQL({
      url: databaseUrl,
      ...(process.env.DATABASE_AUTH_TOKEN
        ? {
            authToken: process.env.DATABASE_AUTH_TOKEN,
          }
        : {}),
    }),
});
