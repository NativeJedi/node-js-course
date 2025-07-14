import http from 'http';
import { handleRoute } from './lib/route.js';

const server = http.createServer(handleRoute);

server.listen(3000, () => {
  console.log('Server run on http://localhost:3000');
});
