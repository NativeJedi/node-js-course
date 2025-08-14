import { ExpressExecutionContext } from '../../core/decorators/utils';
import { HttpError, NotFoundError } from '../../core/errors';
import { Catch, ExceptionFilter } from '../../core/decorators/use-filters';
import { Injectable } from '../../core/decorators/injectable';

@Injectable()
@Catch(NotFoundError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpError, host: ExpressExecutionContext) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.status;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
