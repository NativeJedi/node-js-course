import { ErrorRequestHandler } from 'express';
import { ClassInstance } from '../../types';
import { Filter, runFilters } from '../../decorators/use-filters';

export const FiltersMiddleware = (
  controller: ClassInstance,
  handler: Function,
  filters: Array<Filter>
): ErrorRequestHandler => {
  return async (err, req, res, _next) => {
    const isCaught = await runFilters(
      controller,
      handler,
      err,
      req,
      res,
      filters
    );

    if (isCaught) {
      return;
    }

    // default error handling
    if (err.name === 'HttpError') {
      res.status(err.status).send({ error: err.message, data: err.data });
      return;
    }

    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  };
};
