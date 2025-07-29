This demo describes transaction isolation

`READ COMMITTED`
This is the default isolation level in PostgreSQL.
A transaction running under this mode only sees data that has already been committed by other transactions.
Uncommitted changes made by other transactions are not visible.

No additional settings are required — it's enabled by default.

For running demo `npm run demo:rc`

`READ UNCOMMITED`
This mode allows a transaction to see uncommitted changes from other transactions.
PostgreSQL does not support true READ UNCOMMITTED

To simulate this mode in PostgreSQL, we can use a hack:
```sql
SET default_transaction_read_only = on;
LOCK TABLE posts IN SHARE MODE;
```

For running demo `npm run demo:ru`
