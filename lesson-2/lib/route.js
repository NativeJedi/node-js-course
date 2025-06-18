import { sendResponse } from '../utils/network.js';

function getUrlParams(path) {
  const params = [];
  const routePath = path.replace(/(\/[^/]+)\/(\d+)/g, (match, pathSlice, id) => {
    params.push(id);
    return `${pathSlice}/[id]`;
  });
  return { routePath, params };
}

const handleRoute = async (req, res) => {
  try {
    const { method, url } = req;

    const { routePath, params } = getUrlParams(url);

    const router = await import(`../routes${routePath}/route.js`);

    const handler = router[method];

    if (!handler) {
      sendResponse(res, 405, { error: `${method} method is not allowed for ${url}` });
      return;
    }

    handler(req, res, params).catch((error) => {
      if (error.name === 'AppError') {
        sendResponse(res, error.statusCode, { error: error.message });
      } else {
        throw error;
      }
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
};

export { handleRoute };
