import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Store } from '../store/store';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [Store, UsersService],
})
export class UsersModule {}
