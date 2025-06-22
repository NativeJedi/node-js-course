const parseReq = (req) => {
  const { pathname, searchParams } = new URL(req.url, 'http://x');

  return {
    path: pathname,
    searchParams,
    method: req.method,
  };
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const getRequestData = (req) =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(JSON.parse(body));
    });

    req.on('error', reject);
  });

export { sendResponse, getRequestData, parseReq };
