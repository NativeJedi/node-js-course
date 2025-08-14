import { OmitType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class ChatDTO {
  id!: string;
  name!: string;
  members!: string[];
  updatedAt!: string;
}

export class CreateChatDTO extends OmitType(ChatDTO, [
  'id',
  'updatedAt',
] as const) {
  @IsString()
  @IsOptional()
  name: string = '';

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  members!: string[];
}

export class UpdateChatDTO {
  @IsArray()
  @IsString({ each: true })
  add: ChatDTO['members'] = [];

  @IsArray()
  @IsString({ each: true })
  remove: ChatDTO['members'] = [];
}
