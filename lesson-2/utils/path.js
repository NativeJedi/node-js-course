import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, stat, readdir } from 'node:fs/promises';

const getFullFilePath = (filePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, filePath);
};

const isFolderExists = (path) => stat(path).then((entry) => entry.isDirectory()).catch(() => false);

const isFileExists = (path) => stat(path).then((entry) => entry.isFile()).catch(() => false);

const findEntryInFolder = (path, pattern) => readdir(path).then((entries) => {
  return entries.find((e) => pattern.test(e));
});

const readFileData = (path) => readFile(path, 'utf-8').then(JSON.parse);

const writeFileData = (path, data) => writeFile(path, JSON.stringify(data, null, 2));

export {
  getFullFilePath,
  readFileData,
  writeFileData,
  isFolderExists,
  isFileExists,
  findEntryInFolder,
};
