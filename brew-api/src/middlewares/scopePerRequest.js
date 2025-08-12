import { container } from '../container.js';

const scopePerRequest = (req, res, next) => {
  req.scope = container.createScope();
  next();
};

export { scopePerRequest };
