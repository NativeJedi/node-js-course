import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';

const getFullFilePath = (filePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, filePath);
};

const readFileData = (path) => readFile(path, 'utf-8').then(JSON.parse);

const writeFileData = (path, data) => writeFile(path, JSON.stringify(data, null, 2));

export { getFullFilePath, readFileData, writeFileData };
