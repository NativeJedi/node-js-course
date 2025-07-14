import { ExpressExecutionContext, setMetaToClassOrProperty } from './utils';
import DECORATORS_KEYS from './keys';
import { ClassInstance, ClassType, isObjectType } from '../types';
import { container } from '../container';
import { Request, Response } from 'express';

type Exception = ClassType;

interface ExceptionFilter {
  catch(
    exception: unknown,
    host: ExpressExecutionContext
  ): void | Promise<void>;
}

type Filter = ClassType<ExceptionFilter>;

function Catch(...exceptions: Array<Exception>): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(DECORATORS_KEYS.catchExceptions, exceptions, target);
  };
}

function UseFilters(...filters: any[]): ClassDecorator & MethodDecorator {
  return function (target: object, methodName?: string | symbol) {
    setMetaToClassOrProperty(
      DECORATORS_KEYS.exceptionFilters,
      filters,
      target,
      methodName
    );
  };
}

function getFilters(
  controller: ClassInstance,
  handler: Function,
  globalFilters: Array<Filter> = []
): Filter[] {
  const classFilters =
    Reflect.getMetadata(
      DECORATORS_KEYS.exceptionFilters,
      controller.constructor
    ) || [];

  const methodFilters =
    Reflect.getMetadata(
      DECORATORS_KEYS.exceptionFilters,
      controller,
      handler.name
    ) || [];

  return [...globalFilters, ...classFilters, ...methodFilters];
}

async function runFilters(
  controller: ClassInstance,
  handler: Function,
  err: unknown,
  req: Request,
  res: Response,
  globalFilters: Filter[]
): Promise<Boolean> {
  const filters = getFilters(controller, handler, globalFilters);

  const FilterClass = filters.find((f) => {
    const catchExceptions = Reflect.getMetadata(
      DECORATORS_KEYS.catchExceptions,
      f
    );

    return isObjectType(err) && catchExceptions.includes(err.constructor);
  });

  if (!FilterClass) {
    return false;
  }

  const filter = container.resolve(FilterClass);

  await filter.catch(
    err,
    new ExpressExecutionContext(controller.constructor, handler, req, res)
  );

  return true;
}

export { UseFilters, ExceptionFilter, Filter, Catch, runFilters };
