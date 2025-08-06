import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [UserController],
  providers: [UserService, NotificationService],
})
export class UserModule {}
