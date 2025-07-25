import { Pool } from 'pg';
import { MigrationService } from './migration.service';
import AppConfig from '../config';
import { SQLStatement } from 'sql-template-strings';
import { QueryBuilder } from './query-builder.service';

type Options = {
  table: string;
};

type WithId = { id: string };

export class OrmService<T extends WithId> {
  private readonly table: string;
  private readonly pool: Pool;
  private readonly initPromise: Promise<void>;
  private readonly queryBuilder: QueryBuilder;

  constructor({ table }: Options) {
    this.pool = new Pool({
      connectionString: AppConfig.DATABASE_URL,
      options: '-c search_path=library',
    });

    this.table = table;

    const migrationService = new MigrationService(this.pool);

    this.initPromise = migrationService.checkMigrations();
    this.queryBuilder = new QueryBuilder(this.table);
  }

  async runQuery(query: SQLStatement | string, values?: unknown[]) {
    await this.initPromise;

    return this.pool.query<T>(query, values);
  }

  async findOne(id: T['id']): Promise<T | null> {
    await this.initPromise;

    const { rows } = await this.runQuery(
      `SELECT * FROM "${this.table}" WHERE id = $1`,
      [id]
    );

    return rows[0] ?? null;
  }

  async save(entity: Omit<T, 'id'>): Promise<T> {
    const insertQuery = this.queryBuilder.insert(entity);

    const { rows } = await this.runQuery(insertQuery, Object.values(entity));

    return rows[0];
  }

  async update(id: T['id'], patch: Partial<Omit<T, 'id'>>): Promise<T> {
    const updateQuery = this.queryBuilder.update(id, patch);

    const { rows } = await this.runQuery(updateQuery);

    return rows[0];
  }

  async find(filters: Partial<T>): Promise<T[]> {
    if (!Object.keys(filters).length) {
      throw new Error('filters is required param');
    }

    const selectQuery = this.queryBuilder.select(filters);

    const { rows } = await this.runQuery(selectQuery);

    return rows;
  }

  async delete(id: T['id']): Promise<void> {
    await this.runQuery(`DELETE FROM "${this.table}" WHERE id = $1`, [id]);
  }
}
