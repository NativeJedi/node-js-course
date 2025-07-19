import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { generateUniqueId } from '../../common/utils';
import { UPLOAD_DIR_PATH } from '../../constants';
import * as path from 'node:path';

export function SaveIconInterceptor(fieldName: string) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: UPLOAD_DIR_PATH,
      filename: (req, file, next) => {
        const fileId = generateUniqueId();
        const ext = extname(file.originalname);
        const fileName = `${fieldName}-${fileId}${ext}`;
        next(null, fileName);
      },
    }),
  });
}

@Injectable()
export class AddIconUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    request.body.iconUrl = file
      ? path.join(UPLOAD_DIR_PATH, file.filename)
      : '';

    return next.handle();
  }
}
