import * as path from 'node:path';

const getRelativePath = (relativePath: string): string => {
  return path.resolve(__dirname, relativePath);
};

export { getRelativePath };
