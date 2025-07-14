import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const now = Date.now();

    const req: Request = ctx.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `[${req.method}] ${req.path} Response time: ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
