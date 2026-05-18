import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  APP_ORIGIN: z.string().min(1).default('http://localhost:8081'),
  ADMIN_API_KEY: z.string().min(12),
});

export const env = envSchema.parse(process.env);
