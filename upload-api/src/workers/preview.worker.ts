import sharp from 'sharp';
import { workerData } from 'node:worker_threads';
import { ERROR_COUNTER_INDEX, SUCCESS_COUNTER_INDEX } from '../utils/worker.js';

const run = (job: {
  input: string;
  output: string;
  buffer: SharedArrayBuffer;
}) => {
  const counter = new Int32Array(job.buffer);

  return sharp(job.input)
    .resize(150)
    .toFile(job.output)
    .then(() => {
      Atomics.add(counter, SUCCESS_COUNTER_INDEX, 1);
    })
    .catch(() => {
      Atomics.add(counter, ERROR_COUNTER_INDEX, 1);
    });
};

run(workerData);
