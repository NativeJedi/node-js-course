import DECORATORS_KEYS from './keys';

function Controller(baseUrl: string): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(DECORATORS_KEYS.controllerBaseUrl, baseUrl, target);
  };
}

export { Controller };
