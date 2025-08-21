import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationPipe } from './global-pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(validationPipe);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
