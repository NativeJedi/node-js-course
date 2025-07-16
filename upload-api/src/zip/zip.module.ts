import { Module } from '@nestjs/common';
import { ZipService } from './zip.service.js';
import { ZipController } from './zip.controller.js';

@Module({
  controllers: [ZipController],
  providers: [ZipService],
})
export class ZipModule {}
