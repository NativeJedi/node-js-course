import { Worker } from 'node:worker_threads';
import path from 'node:path';
import { getRelativePath } from './path.js';

const SUCCESS_COUNTER_INDEX = 0;
const ERROR_COUNTER_INDEX = 1;

const createJobCounter = () => {
  const buffer = new SharedArrayBuffer(8);
  const value = new Int32Array(buffer);
  Atomics.store(value, 0, 0);

  return {
    buffer,
    value,
    getSuccessCount: () => Atomics.load(value, SUCCESS_COUNTER_INDEX),
    getErrorCount: () => Atomics.load(value, ERROR_COUNTER_INDEX),
  };
};

const runWorker = <T, R>(workerPath: string, data: T): Promise<R | null> =>
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

      resolve(null);
    });
  });

type PreviewWorkerData = {
  input: string;
  output: string;
  buffer: SharedArrayBuffer;
};

const runPreviewWorker =
  ({
    inputFolder,
    outputFolder,
    buffer,
  }: {
    inputFolder: string;
    outputFolder: string;
    buffer: SharedArrayBuffer;
  }) =>
  (file: { name: string }) => {
    const input = path.join(inputFolder, file.name);
    const output = path.join(outputFolder, file.name);

    return runWorker<PreviewWorkerData, { success: boolean }>(
      getRelativePath('../workers/preview.worker.js'),
      {
        input,
        output,
        buffer,
      },
    );
  };

export {
  runPreviewWorker,
  createJobCounter,
  SUCCESS_COUNTER_INDEX,
  ERROR_COUNTER_INDEX,
};
