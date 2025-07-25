import SQL, { SQLStatement } from 'sql-template-strings';

const getObjEntries = (obj: object) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  return [keys, values];
};

export class QueryBuilder {
  constructor(private readonly table: string) {}

  insert<T extends object>(entity: T): SQLStatement {
    const [keys, values] = getObjEntries(entity);

    const columns = keys.map((k) => `"${k}"`).join(', ');
    const placeholders = values.map((_, i) => SQL`${values[i]}`);

    const query = SQL`INSERT INTO `;

    query.append(SQL([`"${this.table}" (${columns}) VALUES (`]));

    placeholders.forEach((ph, i) => {
      if (i > 0) query.append(SQL`, `);
      query.append(ph);
    });

    query.append(SQL`) RETURNING *`);

    return query;
  }

  update<T extends object>(id: string, entity: Partial<T>): SQLStatement {
    const [keys, values] = getObjEntries(entity);

    const query = SQL`UPDATE `;
    query.append(SQL([`"${this.table}"`]));
    query.append(SQL` SET `);

    keys.forEach((key, i) => {
      if (i > 0) query.append(SQL`, `);
      query.append(SQL([`"${key}"`]));
      query.append(SQL` = ${values[i]}`);
    });

    query.append(SQL` WHERE id = ${id} RETURNING *`);

    return query;
  }

  select<T extends object>(entity: Partial<T>): SQLStatement {
    const [keys, values] = getObjEntries(entity);

    const query = SQL`SELECT * FROM `;
    query.append(SQL([`"${this.table}"`]));

    if (keys.length) {
      query.append(SQL` WHERE `);
      keys.forEach((key, i) => {
        if (i > 0) query.append(SQL` AND `);
        query.append(SQL([`"${key}"`]));
        query.append(SQL` = ${values[i]}`);
      });
    }

    return query;
  }
}
