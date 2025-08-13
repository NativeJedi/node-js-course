import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const TeaQuerySchema = z.object({
  minRating: z.coerce.number().min(0).max(10).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  page: z.coerce.number().min(1).optional().default(1),
});

export class TeaQuery {
  @ApiProperty({
    description: 'Get data with rating greater than or equal to',
    required: false,
    minimum: 0,
    maximum: 10,
  })
  minRating?: number;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Page number to return',
    default: 1,
    required: false,
  })
  page: number;
}
