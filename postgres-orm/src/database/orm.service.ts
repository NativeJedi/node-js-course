import { Pool } from 'pg';
import SQL from 'sql-template-strings';
import { Inject } from '@nestjs/common';
import { PG_POOL } from './pool.provider';

type WithId = { id: string };

const parseDbEntity = (obj: object) => {
  const columns = Object.keys(obj)
    .map((key) => `"${key}"`)
    .join(', ');
  const values = Object.values(obj);

  const valuesPlaceholders = values.map((_, i) => `$${i + 1}`).join(', ');

  return {
    columns,
    values,
    valuesPlaceholders,
  };
};

class OrmService {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async findOne<T extends WithId>(
    id: T['id'],
    table: string,
  ): Promise<T | null> {
    const { rows } = await this.pool.query<T>(
      SQL`SELECT 1 from ${table} WHERE id = ${id}`,
    );

    return rows[0];
  }

  async save<T extends WithId>(
    entity: Omit<T, 'id'>,
    table: string,
  ): Promise<T> {
    const { columns, valuesPlaceholders, values } = parseDbEntity(entity);

    const text = `INSERT INTO "${table}" (${columns}) VALUES (${valuesPlaceholders}) RETURNING *`;
    const { rows } = await this.pool.query<T>(text, values);

    return rows[0];
  }
}

export { OrmService };
