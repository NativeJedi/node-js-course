import { Injectable } from '@nestjs/common';
import { Dirent } from 'node:fs';
import * as path from 'node:path';
import * as sharp from 'sharp';
import * as AdmZip from 'adm-zip';
import { PREVIEWS_DIST, TMP_DIST_UNZIPPED } from '../constants';
import { createFolders, readFilesFromFolder, remove } from '../utils/fs';
import { runPreviewWorker } from '../utils/worker';

type GenerateResult = {
  input: string;
  output: string | null;
};

async function generateThumbnails(
  files: Dirent[],
  inputFolder: string,
  outputFolder: string,
) {
  performance.mark('start');

  const filesPromises = files.map(
    runPreviewWorker({ inputFolder, outputFolder }),
  );

  const results = await Promise.all(filesPromises);

  const { processed, skipped } = results.reduce(
    (acc, result) => {
      if (result.success) {
        acc.processed++;
      } else {
        acc.skipped++;
      }
      return acc;
    },
    { processed: 0, skipped: 0 },
  );

  performance.mark('end');

  return {
    processed,
    skipped,
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
