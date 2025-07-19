import { IsString, IsNotEmpty } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class UserDTO {
  id!: string;
  name!: string;
  iconUrl!: string;
}

export class CreateUserDTO extends OmitType(UserDTO, ['id'] as const) {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString()
  iconUrl!: string;
}
