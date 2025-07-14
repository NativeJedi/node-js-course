import { addArgumentMetaData } from './utils';
import { ArgumentMetaType } from '../types';

function Body(): ParameterDecorator {
  return function (target, methodName, argumentIndex) {
    if (!methodName) {
      return;
    }

    addArgumentMetaData(target, {
      type: ArgumentMetaType.BODY,
      methodName: methodName.toString(),
      argumentIndex,
      data: {},
    });
  };
}

export { Body };
