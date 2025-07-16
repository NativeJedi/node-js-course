import * as sharp from 'sharp';
import { parentPort, workerData } from 'node:worker_threads';

const run = (job: { input: string; output: string }) =>
  sharp(job.input)
    .resize(150)
    .toFile(job.output)
    .then(() => parentPort?.postMessage?.({ success: true }))
    .catch((e) => {
      const error = e instanceof Error ? e.message : String(e);

      parentPort?.postMessage?.({ success: false, error });
    });

run(workerData);
