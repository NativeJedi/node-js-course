import { OrmService } from '../orm/orm.service';

type UserDTO = {
  id: string;
  name: string;
  age: number;
};

type CreateUserDto = Omit<UserDTO, 'id'>;

type UpdateUserDto = Partial<CreateUserDto>;

class UsersRepository {
  orm: OrmService<UserDTO>;

  constructor() {
    this.orm = new OrmService<UserDTO>({ table: 'users' });
  }

  createUser(dto: CreateUserDto) {
    return this.orm.save(dto);
  }

  async getUserById(id: UserDTO['id']) {
    const user = await this.orm.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserById(id: UserDTO['id'], dto: UpdateUserDto) {
    const user = await this.orm.update(id, dto);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findUsersWithFields(fields: Partial<UserDTO>): Promise<UserDTO[]> {
    return this.orm.find(fields);
  }

  async deleteUserById(id: UserDTO['id']) {
    return this.orm.delete(id);
  }
}

export { UsersRepository };
