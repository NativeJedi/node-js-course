import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  redisUrl: process.env.REDIS_URL || 'http://localhost:3000',
};
