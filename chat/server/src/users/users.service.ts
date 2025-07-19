import { Injectable } from '@nestjs/common';
import { Store } from '../store/store';
import { CreateUserDTO, UserDTO } from '../dto/user.dto';
import { generateUniqueId } from '../common/utils';

const USERS_KEY = 'users';

@Injectable()
class UsersService {
  constructor(private store: Store) {}

  getAll() {
    return this.store.readByKey<'users'>(USERS_KEY) || [];
  }

  async getUsersForConnection(user: UserDTO['name']) {
    const users = await this.getAll();

    return users.filter(({ name }) => name !== user);
  }

  async createOne(dto: CreateUserDTO): Promise<UserDTO> {
    const users = await this.getAll();

    const user = {
      ...dto,
      id: generateUniqueId(),
    };

    await this.store.writeByKey(USERS_KEY, [...users, user]);

    return user;
  }
}

export { UsersService };
