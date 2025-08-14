import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Store } from '../store/store';

@Module({
  controllers: [ChatsController],
  providers: [Store, ChatsService],
  exports: [Store, ChatsService],
})
export class ChatsModule {}
