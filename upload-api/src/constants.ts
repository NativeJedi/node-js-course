import * as path from 'node:path';

const TMP_DIST = './tmp';
const TMP_DIST_ZIPPED = path.join(TMP_DIST, 'zipped');
const TMP_DIST_UNZIPPED = path.join(TMP_DIST, 'unzipped');
const PREVIEWS_DIST = './previews';

export { TMP_DIST, TMP_DIST_ZIPPED, TMP_DIST_UNZIPPED, PREVIEWS_DIST };
