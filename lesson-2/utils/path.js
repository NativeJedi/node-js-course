import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const getFullFilePath = (filePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, filePath);
};

export { getFullFilePath };
