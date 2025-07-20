import { Store } from '../store/store';
import { UserDTO } from '../dto/user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatDTO, CreateChatDTO, UpdateChatDTO } from '../dto/chat.dto';
import { generateUniqueId } from '../common/utils';

type PartialChatDto = Omit<ChatDTO, 'id' | 'updatedAt'> & {
  id?: ChatDTO['id'];
};

const createChatDTO = (chat: PartialChatDto): ChatDTO => {
  return {
    ...chat,
    id: chat.id || generateUniqueId(),
    members: [...new Set(chat.members)],
    updatedAt: new Date().toISOString(),
  };
};

@Injectable()
class ChatsService {
  constructor(private store: Store) {}

  getChats() {
    return this.store.readByKey<'chats'>('chats');
  }

  writeChats(chats: ChatDTO[]) {
    return this.store.writeByKey<'chats'>('chats', chats);
  }

  async getUserChats(user: UserDTO['name']) {
    const chats = await this.getChats();

    const userChats = chats.filter(({ members }) => members.includes(user));

    return userChats;
  }

  async createUserChat(
    user: UserDTO['name'],
    { members, name }: CreateChatDTO,
  ) {
    const chats = await this.getChats();

    const newChat: ChatDTO = createChatDTO({
      name,
      members: [...members, user],
    });

    await this.writeChats([...chats, newChat]);

    return newChat;
  }

  async updateUserChatMembers(
    user: UserDTO['name'],
    id: ChatDTO['id'],
    { add, remove }: UpdateChatDTO,
  ) {
    const chats = await this.getUserChats(user);

    const chatIndex = chats.findIndex((chat) => chat.id === id);

    if (chatIndex === -1) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    const exitingChat = chats[chatIndex];

    const updated = createChatDTO({
      ...exitingChat,
      members: [...exitingChat.members, ...add].filter(
        (member) => !remove.includes(member),
      ),
    });

    chats[chatIndex] = updated;

    await this.writeChats(chats);

    return updated;
  }

  async deleteUserChat(user: UserDTO['name'], id: ChatDTO['id']) {
    const userChats = await this.getUserChats(user);

    const chatIndex = userChats.findIndex((chat) => chat.id === id);

    if (chatIndex === -1) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    const updatedChats = userChats.filter((chat) => chat.id !== id);

    await this.writeChats(updatedChats);
  }
}

export { ChatsService };
