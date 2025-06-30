import { config } from '../config/index.js';
import morgan from 'morgan';
import pino from 'pino-http';

const logger = () => {
  const { env } = config;

  return env === 'development'
    ? morgan('dev') // Morgan для development
    : pino(); // Pino для production з JSON-логами
};

export { logger };
