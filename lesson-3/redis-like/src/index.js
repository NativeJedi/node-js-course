import { createServer } from 'node:http';
import { parseReq, sendResponse, getRequestData } from './utils.js';

const store = new Map();

const server = createServer(async (req, res) => {
  try {
    const { path, searchParams, method } = parseReq(req);

    if (method === 'GET' && path === '/get') {
      const key = searchParams.get('key');

      const value = store.get(key);

      sendResponse(res, 200, { value: value || null });
      return;
    }

    if (method === 'POST' && path === '/set') {
      const data = await getRequestData(req);

      const { key, value } = data;

      if (key) {
        store.set(key, value);
      }

      sendResponse(res, 200, { message: 'Value set successfully' });
      return;
    }

    sendResponse(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing request:', error);
    sendResponse(res, 500, { error: 'Internal Server Error' });
  }
});

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
