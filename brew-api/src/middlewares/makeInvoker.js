const makeInvoker = (controller) => {
  return (method) => {
    return async (req, res, next) => {
      try {
        const ctl = req.scope.resolve(controller);
        await ctl[method](req, res);
      } catch (error) {
        next(error);
      }
    };
  };
};

export { makeInvoker };
