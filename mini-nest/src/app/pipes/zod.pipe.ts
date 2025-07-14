import { ZodSchema } from 'zod';
import { PipeTransform } from '../../core/decorators/use-pipes';
import { ValidationError } from '../../core/errors';

const getErrorData = (err: any) => {
  try {
    return JSON.parse(err.message);
  } catch {
    return null;
  }
};

class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (err: any) {
      throw new ValidationError(getErrorData(err));
    }
  }
}

export { ZodValidationPipe };
