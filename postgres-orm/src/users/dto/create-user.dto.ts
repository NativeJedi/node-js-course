import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDTO } from './user.dto';

export class CreateUserDto extends OmitType(UserDTO, ['id'] as const) {
  @IsString()
  @IsNotEmpty()
  name: string;
}
