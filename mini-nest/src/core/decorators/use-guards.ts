import { Request, Response } from 'express';
import { ExpressExecutionContext, setMetaToClassOrProperty } from './utils';
import DECORATORS_KEYS from './keys';
import { ClassInstance, ClassType } from '../types';
import { container } from '../container';

interface CanActivate {
  canActivate(context: ExpressExecutionContext): boolean | Promise<boolean>;
}

type Guard = ClassType<CanActivate>;

function UseGuards(...guards: Function[]): ClassDecorator & MethodDecorator {
  return (target: object, methodName?: string | symbol) => {
    setMetaToClassOrProperty(
      DECORATORS_KEYS.guards,
      guards,
      target,
      methodName
    );
  };
}

const getGuards = (
  controller: ClassInstance,
  handler: Function,
  globalGuards: Array<Guard> = []
) => {
  const controllerGuards =
    Reflect.getMetadata(DECORATORS_KEYS.guards, controller.constructor) ?? [];

  const routeGuards =
    Reflect.getMetadata(DECORATORS_KEYS.guards, controller, handler.name) ?? [];

  return [...globalGuards, ...controllerGuards, ...routeGuards];
};

async function runGuards(
  controller: ClassInstance,
  handler: Function,
  req: Request,
  res: Response,
  globalGuards: Array<Guard> = []
): Promise<boolean | string> {
  const guards = getGuards(controller, handler, globalGuards);

  for (const GuardClass of guards) {
    const instance = container.resolve<CanActivate>(GuardClass);

    if (!instance.canActivate) {
      throw new Error(
        `Guard ${GuardClass.name} does not implement canActivate method`
      );
    }

    const ctx = new ExpressExecutionContext(
      controller.constructor,
      handler,
      req,
      res
    );

    const can = await instance.canActivate(ctx);

    if (!can) {
      return GuardClass.name;
    }
  }

  return true;
}

export { UseGuards, runGuards, Guard, CanActivate };
