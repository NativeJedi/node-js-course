import { Global, Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { RetryModule } from '../retry/retry.module';

@Global()
@Module({
  imports: [RetryModule],
  controllers: [LoggerController],
})
export class LoggerModule {}
