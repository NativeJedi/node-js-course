import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfileDto {
  @IsString({ message: 'Display name must be a string' })
  @Length(2) // мінімум 2 символи
  @Transform(({ value }) => (value as string).trim())
  displayName: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age must be >= 0' })
  age?: number;
}
