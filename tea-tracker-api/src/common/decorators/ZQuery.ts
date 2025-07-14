import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { Request } from 'express';

export function ZQuery<T>(schema: ZodSchema<T>) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest<Request>();
    const result = schema.safeParse(req.query);

    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return result.data;
  })();
}
