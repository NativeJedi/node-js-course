import { Token } from '../container';
import DECORATORS_KEYS from './keys';

function Inject(token: Token): ParameterDecorator {
  return function (target, _propertyKey, parameterIndex) {
    const existing =
      Reflect.getMetadata(DECORATORS_KEYS.injectTokens, target) || {};

    existing[parameterIndex] = token;

    Reflect.defineMetadata(DECORATORS_KEYS.injectTokens, existing, target);
  };
}

export { Inject };
