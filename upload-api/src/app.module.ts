import { Module } from '@nestjs/common';
import { ZipModule } from './zip/zip.module.js';

@Module({
  imports: [ZipModule],
})
export class AppModule {}
