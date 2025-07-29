import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransferModule } from './transfer/transfer.module';
import { AppConfig } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './data-source';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => AppConfig],
    }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    AccountModule,
    TransferModule,
  ],
})
export class AppModule {}
