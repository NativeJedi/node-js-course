const http = require('http');
const { PORT } = require('./constants');
const { userRouter } = require('./controller/users');

const routes = {
  '/users': userRouter,
};

const server = http.createServer((req, res) => {
  const router = routes[req.url];

  if (router) {
    router(req, res);
  } else {
    sendErrorResponse(res, 404, `Cannot find route with ${req.url}`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
