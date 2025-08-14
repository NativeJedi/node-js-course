import { addArgumentMetaData } from './utils';
import { ArgumentMetaType } from '../types';

function Query(queryParamName: string): ParameterDecorator {
  return (target, methodName, argumentIndex) => {
    if (!methodName) {
      return;
    }

    addArgumentMetaData(target, {
      type: ArgumentMetaType.QUERY,
      methodName: methodName.toString(),
      argumentIndex,
      data: {
        queryParamName,
      },
    });
  };
}

export { Query };
