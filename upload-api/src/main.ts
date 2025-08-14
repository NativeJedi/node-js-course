import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { createDistFolders } from './utils/fs.js';

async function bootstrap() {
  await createDistFolders();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
