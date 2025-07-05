import { ZodSchema } from 'zod';
import { BadRequestException } from '@nestjs/common';

const META_KEY = 'zod_schema';

type RequestDescriptor<T> = TypedPropertyDescriptor<
  (dto: T, ...args: unknown[]) => unknown
>;

export function ZBody<T>(schema: ZodSchema<T>) {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: RequestDescriptor<T>,
  ): void {
    Reflect.defineMetadata(META_KEY, schema, target, propertyKey);

    const originalMethod = descriptor.value;

    if (!originalMethod) return;

    descriptor.value = async function (dto: T, ...args: unknown[]) {
      const result = await schema.safeParseAsync(dto);

      if (!result.success) {
        throw new BadRequestException(result.error.format());
      }

      return originalMethod.call(this, result.data, ...args);
    };
  };
}
