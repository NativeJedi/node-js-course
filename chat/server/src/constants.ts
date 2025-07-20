import * as path from 'node:path';

const UPLOAD_DIR_PATH = './uploads';
const DB_DIR = './db';
const DB_FILE_NAME = 'db.json';
const DB_PATH = path.join(DB_DIR, DB_FILE_NAME);

export { UPLOAD_DIR_PATH, DB_DIR, DB_PATH, DB_FILE_NAME };
