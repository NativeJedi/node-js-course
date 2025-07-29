import * as process from 'node:process';

const AppConfig = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: process.env.PORT || 3000,
  ENV: process.env.NODE_ENV || 'production',
};

export { AppConfig };
