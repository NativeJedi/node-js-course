import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = Symbol('PG_POOL');

export const poolProvider: Provider = {
  provide: PG_POOL,
  useFactory: (config: ConfigService) => {
    return new Pool({
      connectionString: config.get<string>('DATABASE_URL'),
      options: '-c search_path=library',
    });
  },
  inject: [ConfigService],
};
