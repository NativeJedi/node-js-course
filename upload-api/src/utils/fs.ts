import {
  PREVIEWS_DIST,
  TMP_DIST_UNZIPPED,
  TMP_DIST_ZIPPED,
} from '../constants.js';
import fs from 'node:fs/promises';

const createFolders = async (foldersPaths: string[]) => {
  const promises = foldersPaths.map((d) => fs.mkdir(d, { recursive: true }));

  await Promise.all(promises);
};

const createDistFolders = async () =>
  createFolders([PREVIEWS_DIST, TMP_DIST_ZIPPED, TMP_DIST_UNZIPPED]);

const readFilesFromFolder = async (folderPath: string) => {
  const rootFiles = await fs.readdir(folderPath, { withFileTypes: true });

  return rootFiles.filter((file) => file.isFile());
};

const remove = async (paths: string[]) => {
  await Promise.all(
    paths.map((p) => fs.rm(p, { recursive: true, force: true })),
  );
};

export { createFolders, createDistFolders, readFilesFromFolder, remove };
