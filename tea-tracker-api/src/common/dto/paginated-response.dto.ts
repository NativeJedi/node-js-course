import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  pageSize: number;

  @ApiProperty({
    example: 15,
    description: 'Total number of items',
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    example: 2,
    description: 'Total number of pages',
    minimum: 1,
  })
  totalPages: number;

  @ApiProperty({ isArray: true })
  data: T[];
}
