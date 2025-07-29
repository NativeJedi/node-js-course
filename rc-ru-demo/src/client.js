import pg from 'pg';

function createClient() {
  return new pg.Client({
    connectionString: 'postgres://postgres:postgres@localhost:5432/rc-ru-demo',
  });
}

async function initTable() {
  const client = createClient();
  await client.connect();
  await client.query(`
    DROP TABLE IF EXISTS posts;
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    );
    INSERT INTO posts (title) VALUES ('initial_title_value');
  `);
  await client.end();
}

export { createClient, initTable };
