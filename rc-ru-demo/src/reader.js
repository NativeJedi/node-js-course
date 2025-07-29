import { createClient } from './client.js';

const READ_QUANTITY = 3;
const mode = process.argv[2] || 'committed';

const logResult = (res) => console.log(`[${new Date().toISOString()}] reader sees:`, res);

const withDelay = (fn) => (...args) => new Promise((resolve, reject) => setTimeout(() => {
  fn(...args).then(resolve).catch(reject);
}, 1000));

async function reader() {
  const client = await createClient();

  await client.connect();

  await client.query('BEGIN');

  if (mode === 'uncommitted') {
    await client.query('SET default_transaction_read_only = on');
    await client.query('LOCK TABLE posts IN SHARE MODE');
  }

  const requestTitleWithDelay = withDelay(async () => {
    const res = await client.query(`SELECT title FROM posts WHERE id = 1`);

    return res.rows[0]?.title;
  });

  for (let i = 0; i < READ_QUANTITY; i++) {
    console.log(`[${new Date().toISOString()}] reader reads`);
    const title = await requestTitleWithDelay();
    logResult(title);
  }

  await client.query('COMMIT');
  await client.end();
}

reader().catch((err) => {
  console.error(`[${new Date().toISOString()}] ❌ reader error:`, err);
  process.exit(1);
});
