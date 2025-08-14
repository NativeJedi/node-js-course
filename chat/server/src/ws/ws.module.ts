import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [RedisModule, MessagesModule],
  providers: [ChatGateway],
})
export class WsModule {}
