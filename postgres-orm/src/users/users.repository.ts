import { Injectable } from '@nestjs/common';
import { OrmService } from '../database/orm.service';
import { UserDTO } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
class UsersRepository {
  constructor(private orm: OrmService) {}

  getUserById(id: UserDTO['id']) {
    return this.orm.findOne<UserDTO>(id, 'users');
  }

  createUser(dto: CreateUserDto) {
    return this.orm.save<UserDTO>(dto, 'users');
  }
}

export { UsersRepository };
