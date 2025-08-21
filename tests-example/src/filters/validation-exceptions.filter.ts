import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';

const getMessage = (response: string | object) => {
  if (typeof response === 'string') {
    return response;
  }

  if (typeof response === null) {
    return 'Unknown error';
  }

  if (!('message' in response)) {
    return response;
  }

  const message = response['message'];

  if (Array.isArray(message)) {
    return message[0] || 'Unknown error';
  }

  return response.message;
};

@Injectable()
@Catch(BadRequestException)
export class ValidationExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const exceptionResponse = exception.getResponse();

    this.logger.error('Validation failed', getMessage(exceptionResponse));

    const response = ctx.getResponse();
    response.status(exception.getStatus()).json(exceptionResponse);
  }
}
