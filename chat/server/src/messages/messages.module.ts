import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Store } from '../store/store';

@Module({
  controllers: [MessagesController],
  providers: [Store, MessagesService],
  exports: [Store, MessagesService],
})
export class MessagesModule {}
