import { Injectable, NotFoundException } from '@nestjs/common';
import { Store } from '../store/store';
import { CreateUserDTO, UserDTO } from '../dto/user.dto';
import { generateUniqueId } from '../common/utils';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { UPLOAD_DIR_PATH } from '../constants';

const USERS_KEY = 'users';

@Injectable()
class UsersService {
  constructor(private store: Store) {}

  async getAll() {
    const users = await this.store.readByKey<'users'>(USERS_KEY);

    return users || [];
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

  async getUserIcon(iconName: string) {
    const iconPath = path.join(UPLOAD_DIR_PATH, iconName);

    const icon = await fs.readFile(iconPath).catch(() => null);

    if (!icon) {
      throw new NotFoundException('Icon not found');
    }

    return icon;
  }
}

export { UsersService };
