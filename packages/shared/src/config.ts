import { z } from 'zod';

/**
 * Runtime environment configuration validator
 */

const EnvSchema = z.object({
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_CALENDAR_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY: z.string().min(1).optional(),

  // Apps Script bridge (optional, for legacy)
  APPS_SCRIPT_DEPLOYMENT_URL: z.string().url().optional(),
  APPS_SCRIPT_SHARED_SECRET: z.string().min(1).optional(),

  // Smartsheet API (future)
  SMARTSHEET_API_TOKEN: z.string().min(1).optional(),

  // App URLs
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_WEB_BASE_URL: z.string().url().default('http://localhost:3000'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Config = z.infer<typeof EnvSchema>;

/**
 * Load and validate environment configuration at runtime
 * @throws Error if required env vars are missing or invalid
 */
export function loadConfig(): Config {
  const env = process.env;

  try {
    return EnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.issues.map((issue) => issue.path.join('.')).join(', ');
      throw new Error(`Invalid environment configuration: ${missing}`);
    }
    throw error;
  }
}

/**
 * Get config for client-side (only NEXT_PUBLIC_ vars)
 */
export function getClientConfig(): Record<string, string> {
  return {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    WEB_BASE_URL: process.env.NEXT_PUBLIC_WEB_BASE_URL || 'http://localhost:3000',
    GOOGLE_CALENDAR_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || '',
  };
}
