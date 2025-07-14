import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TeasService } from './teas.service';
import { CreateTea, Tea, UpdateTea } from './entities/tea.entity';
import { ZBody } from '../common/decorators/ZBody';
import { TeaSchema, UpdateTeaSchema } from './dto/tea.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ZQuery } from '../common/decorators/ZQuery';
import { AuthGuard, Public } from '../common/guards/auth.guard';
import { TeaQuery, TeaQuerySchema } from './dto/tea-query.dto';
import { PaginatedTeaResponse } from './dto/tea-response.dto';

@UseGuards(AuthGuard)
@Controller('teas')
export class TeasController {
  constructor(private readonly teas: TeasService) {}

  @ApiQuery({ type: TeaQuery })
  @ApiResponse({ type: PaginatedTeaResponse })
  @Public()
  @Get()
  getTeas(
    @ZQuery(TeaQuerySchema) query: TeaQuery,
  ): Promise<PaginatedTeaResponse> {
    return this.teas.getAll(query);
  }

  @ApiResponse({ type: Tea })
  @Get(':id')
  getTea(@Param('id') id: number): Promise<Tea> {
    return this.teas.getOne(Number(id));
  }

  @ApiResponse({ type: Tea })
  @ApiBody({ type: CreateTea })
  @Post()
  @ZBody(TeaSchema)
  createTea(@Body() dto: CreateTea): Promise<Tea> {
    return this.teas.create(dto);
  }

  @ApiResponse({ type: Tea })
  @ApiBody({ type: UpdateTea })
  @Patch(':id')
  @ZBody(UpdateTeaSchema)
  updateTea(@Body() dto: UpdateTea, @Param('id') id: number): Promise<Tea> {
    return this.teas.update(Number(id), dto);
  }

  @Delete(':id')
  removeTea(id: number): Promise<void> {
    return this.teas.remove(id);
  }
}
