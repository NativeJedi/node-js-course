import type { Request, Response } from 'express';
import { ArgumentMetaData } from '../types';
import DECORATORS_KEYS from './keys';

const setMetaToClassOrProperty = (
  key: DECORATORS_KEYS,
  data: unknown,
  target: object,
  propertyKey?: string | symbol
) => {
  if (typeof propertyKey === 'string') {
    Reflect.defineMetadata(key, data, target, propertyKey);
  } else {
    Reflect.defineMetadata(key, data, target);
  }
};

const getArgumentMetaData = (target: object): ArgumentMetaData[] =>
  Reflect.getOwnMetadata(DECORATORS_KEYS.methodArgs, target.constructor) || [];

const addArgumentMetaData = (target: object, metadata: ArgumentMetaData) => {
  const existingArguments = getArgumentMetaData(target);

  existingArguments.push(metadata);

  Reflect.defineMetadata(
    DECORATORS_KEYS.methodArgs,
    existingArguments,
    target.constructor
  );
};

export interface ExecutionContext {
  getClass(): Function;
  getHandler(): Function;

  switchToHttp(): {
    getRequest: () => Request;
    getResponse: () => Response;
  };
}

class ExpressExecutionContext implements ExecutionContext {
  constructor(
    private readonly targetClass: Function,
    private readonly targetHandler: Function,
    private readonly req: Request,
    private readonly res: Response
  ) {}

  getClass(): Function {
    return this.targetClass;
  }

  getHandler(): Function {
    return this.targetHandler;
  }

  switchToHttp() {
    return {
      getRequest: () => this.req,
      getResponse: () => this.res,
    };
  }
}

export {
  getArgumentMetaData,
  addArgumentMetaData,
  ExpressExecutionContext,
  setMetaToClassOrProperty,
};
