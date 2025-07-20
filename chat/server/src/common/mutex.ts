import * as fs from 'fs/promises';

const RETRIES = 10;
const RETRY_DELAY = 100;

class Mutex {
  private readonly lockFile: string;

  constructor(filePath: string) {
    this.lockFile = filePath + '.lock';
  }

  async lock(): Promise<void> {
    for (let i = 0; i < RETRIES; i++) {
      try {
        const handle = await fs.open(this.lockFile, 'wx'); // x flag throws an error if file exists
        await handle.close();
        return;
      } catch {
        await new Promise((res) => setTimeout(res, RETRY_DELAY));
      }
    }
    throw new Error('Cannot acquire lock');
  }

  async unlock(): Promise<void> {
    try {
      await fs.unlink(this.lockFile);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err;
      }
    }
  }
}

export { Mutex };
