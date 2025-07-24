import { Module } from '@nestjs/common';
import { OrmService } from './orm.service';
import { poolProvider } from './pool.provider';
import { MigrationService } from './migration.service';

@Module({
  providers: [OrmService, poolProvider, MigrationService],
  exports: [OrmService],
})
export class DatabaseModule {}
