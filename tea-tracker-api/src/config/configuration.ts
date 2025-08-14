import pkg from '../../package.json';
import * as process from 'node:process';

export const AppConfig = {
  API_KEY: process.env.API_KEY || 'im_rd_student',
  APP_VERSION: (pkg as { version: string }).version || '0.0.0',
  APP_REQUEST_TTL: process.env.APP_REQUEST_TTL || 60000,
  APP_REQUEST_LIMIT: process.env.APP_REQUEST_LIMIT || 10,
  APP_AUTH_HEADER: process.env.APP_AUTH_HEADER || 'x-api-key',
};

export default () => AppConfig;
