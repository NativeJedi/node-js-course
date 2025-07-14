import 'reflect-metadata';
import { Factory } from './core/http';
import { BooksModule } from './app/books/books.module';
import { AppConfig, appConfigSchema } from './app/config';
import { ConfigModule } from './core/config';

//catch uncaughtException
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack || err);
  process.exit(1);
});

ConfigModule.forRoot({ schema: appConfigSchema });

const app = Factory([BooksModule]);

const port = 8080;

app.listen(port, () =>
  console.log(`Mini-Nest listening on http://localhost:${port}`)
);
