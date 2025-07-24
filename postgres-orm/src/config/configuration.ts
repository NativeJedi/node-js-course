import * as process from 'node:process';
import { join } from 'path';

const DEFAULT_MIGRATIONS_DIR = join(__dirname, '../../migrations');

export default () => ({
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: process.env.PORT || 3000,
  MIGRATIONS_DIR: process.env.MIGRATIONS_DIR || DEFAULT_MIGRATIONS_DIR,
});
