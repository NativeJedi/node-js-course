import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatDTO, CreateChatDTO, UpdateChatDTO } from '../dto/chat.dto';
import { ChatsService } from './chats.service';

@Controller('/api/chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  async create(
    @Headers('X-User') user: string,
    @Body() dto: CreateChatDTO,
  ): Promise<ChatDTO> {
    return this.chatsService.createUserChat(user, dto);
  }

  @Get()
  async list(@Headers('X-User') user: string) {
    const items = await this.chatsService.getUserChats(user);

    return {
      items,
    };
  }

  @Patch(':id/members')
  async patch(
    @Headers('X-User') user: string,
    @Param('id') id: string,
    @Body() dto: UpdateChatDTO,
  ) {
    return this.chatsService.updateUserChatMembers(user, id, dto);
  }

  @Delete(':id')
  async delete(@Headers('X-User') user: string, @Param('id') id: string) {
    await this.chatsService.deleteUserChat(user, id);
  }
}
