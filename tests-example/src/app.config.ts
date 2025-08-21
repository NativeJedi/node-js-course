import * as process from 'node:process';
import * as dotenv from 'dotenv';

dotenv.config();

const AppConfig = {
  API_KEY: process.env.API_KEY || '',
};

export default () => AppConfig;
