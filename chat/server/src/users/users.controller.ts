import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  ForbiddenException,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
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
  async icon(@Param('iconPath') iconPath: string, @Res() res: Response) {
    throw new ForbiddenException('Not implemented yet');
  }
}
