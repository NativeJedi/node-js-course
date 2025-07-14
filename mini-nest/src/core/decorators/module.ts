import DECORATORS_KEYS from './keys';
import { ClassType, isObjectType } from '../types';
import { Token } from '../container';

type UseClassProvider = {
  token: Token;
  useClass: ClassType;
};

type UseValueProvider<T = unknown> = {
  token: Token;
  useValue: T;
};

type Provider = ClassType | UseClassProvider | UseValueProvider;

type ModuleData = {
  providers?: Provider[];
  controllers?: ClassType[];
  imports?: ClassType[];
};

const isUseClassProvider = (provider: Provider): provider is UseClassProvider =>
  isObjectType(provider) && 'token' in provider && 'useClass' in provider;

const isUseValueProvider = (provider: Provider): provider is UseValueProvider =>
  isObjectType(provider) && 'token' in provider && 'useValue' in provider;

function Module(metadata: ModuleData): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(DECORATORS_KEYS.modules, metadata, target);
  };
}

export {
  Module,
  ModuleData,
  Provider,
  isUseClassProvider,
  UseClassProvider,
  isUseValueProvider,
  UseValueProvider,
};
