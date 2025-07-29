import { AppConfig } from './config/configuration';
import { createApp } from './bootstrap';

async function bootstrap() {
  const app = await createApp();

  await app.listen(AppConfig.PORT);
}

bootstrap();
