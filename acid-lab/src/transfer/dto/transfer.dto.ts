import { Transfer } from '../entities/transfer.entity';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class CreateTransferDto extends PickType(Transfer, ['amount']) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '961b8b08-f0e4-4551-ad83-c48572b207f6',
    required: true,
  })
  from_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '961b8b08-f0e4-4551-ad83-c48572b207f6',
    required: true,
  })
  to_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '20.00',
    required: true,
  })
  amount: string;
}

export { CreateTransferDto };
