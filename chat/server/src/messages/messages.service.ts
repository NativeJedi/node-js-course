import { Store } from '../store/store';
import { Injectable } from '@nestjs/common';
import { MessageDTO } from '../dto/message.dto';
import { UserDTO } from '../dto/user.dto';
import { generateUniqueId } from '../common/utils';

@Injectable()
export class MessagesService {
  constructor(private store: Store) {}

  read() {
    return this.store.readByKey<'messages'>('messages') || [];
  }

  write(messages: MessageDTO[]) {
    return this.store.writeByKey<'messages'>('messages', messages);
  }

  async addChatMessage(
    user: UserDTO['name'],
    chatId: MessageDTO['chatId'],
    text: MessageDTO['text'],
  ): Promise<MessageDTO> {
    const messages = await this.read();

    const message: MessageDTO = {
      id: generateUniqueId(),
      chatId,
      text,
      author: user,
      sentAt: new Date().toISOString(),
    };

    await this.write([...messages, message]);

    return message;
  }

  async getChatMessages(
    chatId: MessageDTO['chatId'],
    { cursor, limit }: { cursor?: string; limit: number },
  ): Promise<MessageDTO[]> {
    const messages = await this.read();

    return messages
      .filter((m) => m.chatId === chatId)
      .filter((m) => (cursor ? m.sentAt < cursor : true))
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
      .slice(0, limit);
  }
}
