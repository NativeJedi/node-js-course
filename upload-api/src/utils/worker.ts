import { Worker } from 'node:worker_threads';
import * as path from 'node:path';
import { getRelativePath } from './path';

const runWorker = <T, R>(workerPath: string, data: T): Promise<R> =>
  new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: data,
    });

    worker.once('message', (result: R) => {
      resolve(result);
    });

    worker.once('error', reject);

    worker.once('exit', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });

type PreviewWorkerData = {
  input: string;
  output: string;
};

const runPreviewWorker =
  ({
    inputFolder,
    outputFolder,
  }: {
    inputFolder: string;
    outputFolder: string;
  }) =>
  (file: { name: string }) => {
    const input = path.join(inputFolder, file.name);
    const output = path.join(outputFolder, file.name);

    return runWorker<PreviewWorkerData, { success: boolean }>(
      getRelativePath('../workers/preview.worker.js'),
      {
        input,
        output,
      },
    );
  };

export { runPreviewWorker };
