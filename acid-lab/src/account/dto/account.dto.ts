import { OmitType } from '@nestjs/mapped-types';
import { Account } from '../entities/account.entity';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateAccountDto extends OmitType(Account, ['id', 'balance'] as const) {
  @ApiProperty({ example: '20.00', required: false, default: '0.00' })
  @IsString()
  @IsOptional()
  balance?: string;
}

class UpdateAccountDto extends OmitType(Account, ['id'] as const) {
  @ApiProperty({ example: '20.00', required: true })
  @IsString()
  balance: string;
}

export { CreateAccountDto, UpdateAccountDto };
