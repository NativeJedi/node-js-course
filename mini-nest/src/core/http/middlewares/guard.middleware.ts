import { Guard, runGuards } from '../../decorators/use-guards';
import { ClassInstance } from '../../types';
import { NextFunction, Request, Response } from 'express';

const GuardsMiddleware =
  (
    controller: ClassInstance,
    handler: Function,
    globalGuards: Array<Guard> = []
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const guardResult = await runGuards(
      controller,
      handler,
      req,
      res,
      globalGuards
    );
    if (guardResult === true) {
      return next();
    }

    res.status(403).json({ message: `Forbidden by ${guardResult}` });
  };

export { GuardsMiddleware };
