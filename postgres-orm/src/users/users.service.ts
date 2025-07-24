import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.repository.createUser(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: UserDTO['id']) {
    return this.repository.getUserById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
