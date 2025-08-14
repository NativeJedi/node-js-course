enum ArgumentMetaType {
  PARAM = 'param',
  BODY = 'body',
  QUERY = 'query',
}

type BaseArgumentMetaData<T extends ArgumentMetaType, D = object> = Readonly<{
  type: T;
  methodName: string;
  argumentIndex: number;
  data: D;
}>;

type ParamMetaData = BaseArgumentMetaData<
  ArgumentMetaType.PARAM,
  { paramName: string }
>;

type BodyMetaData = BaseArgumentMetaData<ArgumentMetaType.BODY>;

type QueryMetaData = BaseArgumentMetaData<
  ArgumentMetaType.QUERY,
  { queryParamName: string }
>;

type ArgumentMetaData = ParamMetaData | BodyMetaData | QueryMetaData;

type ClassInstance = Record<string, Function>;

type ClassType<T = unknown> = {
  new (...args: any[]): T;
};

const isObjectType = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isClassType = <T>(value: unknown): value is ClassType<T> => {
  return (
    typeof value === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(value))
  );
};

export {
  ArgumentMetaData,
  ClassInstance,
  ClassType,
  ParamMetaData,
  QueryMetaData,
  ArgumentMetaType,
  isClassType,
  isObjectType,
};
