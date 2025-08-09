import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationEvents } from '../notification/notification.entity';

@Injectable()
export class UserService {
  users: User[] = [];

  constructor(private readonly notificationService: NotificationService) {}

  create({ email }: UserDto): User {
    const user = { email };

    this.users.push(user);

    this.notificationService.send({ event: NotificationEvents.SignUp });

    return user;
  }
}
