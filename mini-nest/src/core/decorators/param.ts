import { addArgumentMetaData } from './utils';
import { ArgumentMetaType } from '../types';

function Param(paramName: string): ParameterDecorator {
  return function (target, methodName, argumentIndex) {
    if (!methodName) {
      return;
    }

    addArgumentMetaData(target, {
      type: ArgumentMetaType.PARAM,
      methodName: String(methodName),
      argumentIndex,
      data: {
        paramName,
      },
    });
  };
}

export { Param };
