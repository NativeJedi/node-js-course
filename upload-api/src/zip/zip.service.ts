import { Injectable } from '@nestjs/common';
import { Dirent } from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import { PREVIEWS_DIST, TMP_DIST_UNZIPPED } from '../constants.js';
import { createFolders, readFilesFromFolder, remove } from '../utils/fs.js';
import { createJobCounter, runPreviewWorker } from '../utils/worker.js';

async function generateThumbnails(
  files: Dirent[],
  inputFolder: string,
  outputFolder: string,
) {
  performance.mark('start');

  const { buffer, getErrorCount, getSuccessCount } = createJobCounter();

  const filesPromises = files.map(
    runPreviewWorker({ inputFolder, outputFolder, buffer }),
  );

  await Promise.all(filesPromises);

  performance.mark('end');

  return {
    processed: getSuccessCount(),
    skipped: getErrorCount(),
    durationMs: +performance
      .measure('duration', 'start', 'end')
      .duration.toFixed(2),
  };
}

const extractFilesFromZip = async (zipFilePath: string, output: string) => {
  const zip = new AdmZip(zipFilePath);

  zip.extractAllTo(output, true);

  return readFilesFromFolder(output);
};

const createFileDistFolders = async () => {
  const folderId = Date.now().toString();

  const unzippedFolderDist = path.join(TMP_DIST_UNZIPPED, folderId);
  const previewFolderDist = path.join(PREVIEWS_DIST, folderId);

  await createFolders([unzippedFolderDist, previewFolderDist]);

  return {
    unzippedFolderDist,
    previewFolderDist,
    folderId,
  };
};

@Injectable()
export class ZipService {
  async generatePreviews(zip: Express.Multer.File) {
    const { unzippedFolderDist, previewFolderDist } =
      await createFileDistFolders();

    const files = await extractFilesFromZip(zip.path, unzippedFolderDist);

    const stats = await generateThumbnails(
      files,
      unzippedFolderDist,
      previewFolderDist,
    );

    remove([unzippedFolderDist, zip.path]);

    return {
      message: 'Previews generated successfully',
      stats,
    };
  }
}
