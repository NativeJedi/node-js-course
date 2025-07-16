import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZipService } from './zip.service';
import { TMP_DIST_ZIPPED } from '../constants';

@Controller('zip')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: TMP_DIST_ZIPPED }))
  async create(@UploadedFile() zip: Express.Multer.File) {
    return this.zipService.generatePreviews(zip);
  }
}
