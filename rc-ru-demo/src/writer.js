import { createClient, initTable } from './client.js';

async function writer() {
  await initTable(); // створюємо таблицю (можна зробити один раз, або винести в окремий скрипт)

  const client = createClient();
  await client.connect()

  await client.query('BEGIN');
  await client.query(`UPDATE posts SET title = 'updated_title_by_writer' WHERE id = 1`);
  await client.query('SELECT pg_sleep(5)')
  await client.query('COMMIT');

  await client.end();
}

writer();
