import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';

const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const appVersion = configService.get<string>('APP_VERSION') ?? '1.0';

  const config = new DocumentBuilder()
    .setTitle('Tea API')
    .setDescription('API for managing teas')
    .setVersion(appVersion)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(Logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.enableShutdownHooks();

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
