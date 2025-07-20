import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('/api/chats/:id/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async list(
    @Param('id') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '30',
  ) {
    const items = await this.messagesService.getChatMessages(chatId, {
      cursor,
      limit: +limit,
    });

    return {
      items,
    };
  }

  @Post()
  create(
    @Headers('X-User') user: string,
    @Param('id') chatId: string,
    @Body('text') text: string,
  ) {
    return this.messagesService.addChatMessage(user, chatId, text);
  }
}
