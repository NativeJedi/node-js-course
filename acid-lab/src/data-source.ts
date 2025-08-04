import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppConfig } from './config/configuration';
import { Account } from './account/entities/account.entity';
import { Transfer } from './transfer/entities/transfer.entity';

const ProductionConfig: DataSourceOptions = {
  type: 'postgres',
  url: AppConfig.DATABASE_URL,
  entities: [Account, Transfer],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
};

const DevelopmentConfig: DataSourceOptions = {
  ...ProductionConfig,
  synchronize: true,
};

const envConfigMap: Record<string, DataSourceOptions> = {
  test: DevelopmentConfig,
  development: DevelopmentConfig,
  production: ProductionConfig,
};

const TypeOrmConfig = envConfigMap[AppConfig.ENV] || envConfigMap.production;

const AppDataSource = new DataSource(TypeOrmConfig);

export { AppDataSource, TypeOrmConfig };
