import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load env variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_ORIGIN: z.string().default('http://localhost:5000'),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  
  // Database
  MONGODB_URI: z.string().optional(), // Optional to allow local JSON file fallback
  
  // Security / JWT
  ACCESS_TOKEN_SECRET: z.string().default('dev_access_secret_super_secure_12345'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().default('dev_refresh_secret_super_secure_67890'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  
  // Third-party simulation / mock settings
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  RAZORPAY_KEY_ID: z.string().default('rzp_test_mockkey12345'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_test_secret12345'),
  
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@ecom-dummy.com'),
  
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

// Security validation in production
if (env.NODE_ENV === 'production') {
  const missingSecrets: string[] = [];
  if (env.ACCESS_TOKEN_SECRET === 'dev_access_secret_super_secure_12345') {
    missingSecrets.push('ACCESS_TOKEN_SECRET');
  }
  if (env.REFRESH_TOKEN_SECRET === 'dev_refresh_secret_super_secure_67890') {
    missingSecrets.push('REFRESH_TOKEN_SECRET');
  }
  if (!env.MONGODB_URI) {
    missingSecrets.push('MONGODB_URI');
  }
  if (missingSecrets.length > 0) {
    console.error(`❌ Production security check failed. Missing or default values for: ${missingSecrets.join(', ')}`);
    process.exit(1);
  }
}
