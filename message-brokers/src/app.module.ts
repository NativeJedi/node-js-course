import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [RedisModule, LoggerModule, UserModule],
})
export class AppModule {}
