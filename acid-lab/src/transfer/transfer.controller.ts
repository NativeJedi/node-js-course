import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  create(@Body() dto: CreateTransferDto) {
    return this.transferService.create(dto);
  }

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferService.findOne(+id);
  }
}
