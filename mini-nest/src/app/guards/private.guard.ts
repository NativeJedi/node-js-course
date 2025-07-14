import { CanActivate } from '../../core/decorators/use-guards';
import { ExpressExecutionContext } from '../../core/decorators/utils';
import { HttpError } from '../../core/errors';
import { Injectable } from '../../core/decorators/injectable';
import { Config } from '../../core/decorators/config';
import { AppConfig } from '../config';

@Injectable()
class Private implements CanActivate {
  constructor(@Config() private readonly config: AppConfig) {}

  canActivate(ctx: ExpressExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    const role = req.headers[this.config.ROLE_HEADER];

    if (role !== 'admin') {
      throw new HttpError(
        403,
        'User is not authorized to access this resource'
      );
    }

    return true;
  }
}

export { Private };
