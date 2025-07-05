import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

type Nullable<T> = T | null;

export class Tea {
  @ApiProperty({ example: 1751346402735 })
  id: number;

  @ApiProperty({ example: 'Earl Grey' })
  name: string;

  @ApiProperty({
    example: 'India',
    required: false,
    minLength: 2,
    maxLength: 30,
    nullable: true,
  })
  origin: Nullable<string>;

  @ApiProperty({
    example: 2,
    required: false,
    minimum: 1,
    maximum: 5,
    nullable: true,
  })
  rating: Nullable<number>;

  @ApiProperty({
    example: 85,
    required: false,
    minimum: 60,
    maximum: 100,
    nullable: true,
  })
  temp: Nullable<number>;

  @ApiProperty({
    example: 'Aromatic and citrusy',
    required: false,
    maxLength: 150,
    nullable: true,
  })
  notes: Nullable<string>;
}

export class CreateTea extends OmitType(Tea, ['id']) {}

export class UpdateTea extends PartialType(CreateTea) {}
