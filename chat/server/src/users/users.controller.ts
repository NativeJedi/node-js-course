import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO, UserDTO } from '../dto/user.dto';
import { UsersService } from './users.service';
import {
  AddIconUrlInterceptor,
  SaveIconInterceptor,
} from './interceptors/save-icon.interceptor';

@Controller('/api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseInterceptors(SaveIconInterceptor('icon'), AddIconUrlInterceptor)
  createUser(@Body() dto: CreateUserDTO): Promise<UserDTO> {
    return this.usersService.createOne(dto);
  }

  @Get()
  async list(): Promise<{ items: UserDTO[]; total: number }> {
    const items = await this.usersService.getAll();

    return {
      items,
      total: items.length,
    };
  }

  @Get('icons/:iconPath')
  async icon(@Param('iconPath') iconPath: string) {
    return this.usersService.getUserIcon(iconPath);
  }
}
