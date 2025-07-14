import { sendResponse } from '../utils/network.js';
import { loadRouter } from './loadRouter.js';

const handleRoute = async (req, res) => {
  try {
    const { method, url } = req;

    const { router, routeParams } = await loadRouter(url);

    const handler = router[method];

    if (!handler) {
      sendResponse(res, 405, { error: `${method} method is not allowed for ${url}` });
      return;
    }

    await handler(req, res, routeParams);
  } catch (error) {
    if (error.name === 'AppError') {
      sendResponse(res, error.statusCode, { error: error.message });
    } else {
      console.error(error);
      sendResponse(res, 500, { error: 'Internal server error' });
    }
  }
};

export { handleRoute };
