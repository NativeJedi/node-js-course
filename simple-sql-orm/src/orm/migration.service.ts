import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import SQL from 'sql-template-strings';
import AppConfig from '../config';
import { Pool } from 'pg';

export class MigrationService {
  private readonly migrationsDir: string;
  private readonly log: Console;
  private readonly pool: Pool;

  constructor(pool: Pool) {
    const dir = AppConfig.MIGRATIONS_DIR;

    if (!dir) {
      throw new Error(`MIGRATIONS_DIR is not defined. MIGRATIONS_DIR: ${dir}`);
    }

    this.migrationsDir = dir;
    this.log = console;
    this.pool = pool;
  }

  async checkMigrations() {
    await this.ensureMigrationsTable();

    // 1 · зчитуємо список файлів
    const files = (await readdir(this.migrationsDir))
      .filter((f) => f.endsWith('.sql'))
      .toSorted(); // 001_*, 002_* …

    // 2 · які вже застосовані?
    const { rows: done } = await this.pool.query<{
      id: string;
    }>('SELECT id FROM _migrations');
    const doneIds = new Set(done.map((r) => r.id));

    // 3 · цикл по всіх файлаx
    for (const file of files) {
      const id = file.split('.', 1)[0]; // "001_init"
      if (doneIds.has(id)) continue; // пропускаємо

      this.log.log(`Applying migration ${id} …`);
      const sql = await readFile(join(this.migrationsDir, file), 'utf8');

      // запуск у транзакції — одна помилка → відкат
      await this.pool.query('BEGIN');
      try {
        await this.pool.query(sql);
        await this.pool.query(
          SQL`INSERT INTO library._migrations(id) VALUES (${id})`
        );
        await this.pool.query('COMMIT');
        this.log.log(`✓ ${id} applied`);
      } catch (err) {
        await this.pool.query('ROLLBACK');
        this.log.error(`✗ ${id} failed`, err as Error);
        throw err; // зриваємо старт додатку
      }
    }

    this.log.log('Migrations up-to-date ✅');
  }

  private async ensureMigrationsTable() {
    await this.pool.query(
      SQL`
        CREATE SCHEMA IF NOT EXISTS library;
        CREATE TABLE IF NOT EXISTS _migrations(
          id text PRIMARY KEY,
          executed_at timestamptz DEFAULT now()
        )
      `
    );
  }
}
