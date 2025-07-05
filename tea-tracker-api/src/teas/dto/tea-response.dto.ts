import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { Tea } from '../entities/tea.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedTeaResponse extends PaginatedResponse<Tea> {
  @ApiProperty({ type: () => [Tea], description: 'Array of teas' })
  declare data: Tea[];
}
