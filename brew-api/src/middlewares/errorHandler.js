import { config } from '../config/index.js';

const errorHandlersByEnv = {
  development: (err, req, res, _next) => {
    console.log('err', err);
    console.error(err);
    res
      .status(err.statusCode || 500)
      .json({ error: err.message || 'Server error' });
  },
  production: (err, req, res, _next) => {
    if (err.name === 'AppError') {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    req.log.error({ err });
    res.status(500).json({ error: 'Server error' });
  },
};

const errorHandler = () => {
  const { env } = config;

  const handler = errorHandlersByEnv[env] || errorHandlersByEnv.production;

  return handler;
};

export { errorHandler };
