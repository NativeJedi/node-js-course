import { Request, Response } from 'express';
import {
  ArgumentMetaType,
  ClassInstance,
  ArgumentMetaData,
  ParamMetaData,
  QueryMetaData,
} from '../../types';
import { getArgumentMetaData } from '../../decorators/utils';
import { Pipe, runPipes } from '../../decorators/use-pipes';

const requestDataByMetaType: Record<ArgumentMetaType, Function> = {
  param: (req: Request, metaData: ParamMetaData) =>
    req.params[metaData.data.paramName],
  body: (req: Request) => req.body,
  query: (req: Request, metaData: QueryMetaData) =>
    req.query[metaData.data.queryParamName],
};

const extractArgumentsFromRequest =
  (req: Request) => (metaData: ArgumentMetaData) => {
    const getter = requestDataByMetaType[metaData.type];

    if (!getter) {
      throw new Error(`Unsupported argument type: ${metaData.type}`);
    }

    return getter(req, metaData);
  };

const runPipesForArgument =
  ({
    controller,
    handler,
    globalPipes,
    metaData,
  }: {
    controller: ClassInstance;
    handler: Function;
    globalPipes: Pipe[];
    metaData: ArgumentMetaData[];
  }) =>
  (arg: unknown, index: number) => {
    return runPipes(controller, handler, arg, metaData[index], globalPipes);
  };

const HandlerMiddleware = (
  controller: ClassInstance,
  handler: Function,
  globalPipes: Pipe[]
) => {
  return async (req: Request, res: Response) => {
    const argumentsMeta = getArgumentMetaData(controller);

    const methodMeta = argumentsMeta.filter(
      ({ methodName }) => methodName === handler.name
    );

    const sortedMeta = [...methodMeta].sort(
      (a, b) => a.argumentIndex - b.argumentIndex
    );

    const args = sortedMeta.map(extractArgumentsFromRequest(req)).map(
      runPipesForArgument({
        controller,
        handler,
        globalPipes,
        metaData: sortedMeta,
      })
    );

    const resolvedArgs = await Promise.all(args);

    const result = await handler.apply(controller, resolvedArgs);

    res.send(result);
  };
};

export { HandlerMiddleware };
