const path = require('path');
const fs = require('fs').promises;

class DataParser {
  constructor(fileName) {
    this.fileName = fileName;
    this.filePath = path.join(__dirname, 'data', fileName);
  }

  async read() {
    const data = await fs.readFile(this.filePath, 'utf-8');
    
    return JSON.parse(data);
  }

  async write(data) {
    return fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}   

const getBodyFromRequest = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const result = JSON.parse(body);
      resolve(result);
    });

    req.on('error', reject);
  });
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const sendErrorResponse = (res, statusCode, error) => {
  console.error(error);
  sendResponse(res, statusCode, { error });
};

module.exports = {
  DataParser,
  getBodyFromRequest,
  sendResponse,
  sendErrorResponse,
};
