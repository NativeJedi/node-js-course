import {
  ArgumentMetaData,
  ClassInstance,
  ClassType,
  isClassType,
} from '../types';
import DECORATORS_KEYS from './keys';
import { container } from '../container';
import { setMetaToClassOrProperty } from './utils';

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetaData): R | Promise<R>;
}

type Pipe = ClassType<PipeTransform> | InstanceType<ClassType<PipeTransform>>;

function getPipes(
  controller: ClassInstance,
  handler: Function,
  globalPipes: Pipe[] = []
): Pipe[] {
  const classPipes =
    Reflect.getMetadata(DECORATORS_KEYS.pipes, controller.constructor) ?? [];
  const methodPipes =
    Reflect.getMetadata(DECORATORS_KEYS.pipes, controller, handler.name) ?? [];

  return [...globalPipes, ...classPipes, ...methodPipes];
}

function UsePipes(...pipes: Pipe[]): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    setMetaToClassOrProperty(DECORATORS_KEYS.pipes, pipes, target, propertyKey);
  };
}

async function runPipes(
  controller: ClassInstance,
  handler: Function,
  handlerArgument: unknown,
  meta: ArgumentMetaData,
  globalPipes: Pipe[] = []
) {
  const pipes = getPipes(controller, handler, globalPipes);

  const transformed = pipes.reduce((arg, PipeController) => {
    const instance = isClassType(PipeController)
      ? container.resolve(PipeController)
      : PipeController;

    return Promise.resolve(instance.transform(arg, meta));
  }, handlerArgument);

  return await transformed;
}

export { UsePipes, runPipes, Pipe };
