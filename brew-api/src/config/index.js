import 'dotenv/config';
import pkg from '../../package.json' with { type: 'json' };
import { z } from 'zod';

const env = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const validatedEnv = env.parse(process.env);

export const config = {
  port: validatedEnv.PORT,
  env: validatedEnv.NODE_ENV,
  baseUrl: `http://localhost:${validatedEnv.PORT}`,
  appName: 'Express API',
  appVersion: pkg.version,
};
