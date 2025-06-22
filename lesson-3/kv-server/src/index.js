import { createServer } from 'node:http';
import { parseReq, sendResponse, getRequestData } from './utils.js';
import { config } from '../config/index.js';

const client = {
  get: (url) => fetch(`${config.redisUrl}${url}`).then((res) => res.json()),
  post: (url, data) => {
    return fetch(`${config.redisUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};

const server = createServer(async (req, res) => {
  try {
    const { path, searchParams, method } = parseReq(req);

    if (method === 'GET' && path === '/get') {
      const key = searchParams.get('key');

      const response = await client.get(`/get?key=${encodeURIComponent(key)}`);

      sendResponse(res, 200, { value: response?.value || null });
      return;
    }

    if (method === 'POST' && path === '/set') {
      const data = await getRequestData(req);

      const { key, value } = data;

      if (key) {
        await client.post('/set', { key, value });
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

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
