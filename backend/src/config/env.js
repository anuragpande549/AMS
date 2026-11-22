import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load from backend/.env or root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/ams_db'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long').default('super_secret_jwt_key_attendance_system_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().default(''),
  CLOUDINARY_API_KEY: z.string().default(''),
  CLOUDINARY_API_SECRET: z.string().default(''),
  OFFICE_LATITUDE: z.coerce.number().default(28.6139),
  OFFICE_LONGITUDE: z.coerce.number().default(77.2090),
  GEOFENCE_RADIUS_METERS: z.coerce.number().default(500)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
