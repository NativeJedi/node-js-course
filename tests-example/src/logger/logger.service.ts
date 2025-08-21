import { Injectable } from '@nestjs/common';

@Injectable()
export class AppLogger {
  log(message: string, info: any) {
    console.log('[INFO]', message, info);
  }

  error(message: string, error: any) {
    console.error('[ERROR]', message, error);
  }
}
