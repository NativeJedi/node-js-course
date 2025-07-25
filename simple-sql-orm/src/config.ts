import process from 'node:process';

const DEFAULT_MIGRATIONS_DIR = '../migrations';

const AppConfig = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  MIGRATIONS_DIR: process.env.MIGRATIONS_DIR || DEFAULT_MIGRATIONS_DIR,
};

export default AppConfig;
