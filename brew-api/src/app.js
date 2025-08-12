import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { brewRouter } from './routes/brew.routes.js';
import { scopePerRequest } from './middlewares/scopePerRequest.js';
import { dynamicRateLimit } from './middlewares/rateLimit.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import { config } from './config/index.js';
import { createZodSpec } from './docs/openapi.js';
import { notFound } from './middlewares/notFound.js';

const createApp = () => {
  const app = express();

  //  Security headers
  app.use(helmet());

  // cors()  ➜  Cross-Origin Resource Sharing
  //• Додає заголовки Access-Control-* , щоб браузер дозволив
  //  ваш API викликати з інших доменів / портів.
  //• За замовчуванням відкриває *усі* origins; в проді краще:
  //  app.use(cors({ origin: ['https://my.app'], credentials: true }));
  app.use(cors());

  // compression()  ➜  Gzip / Brotli стиснення Response
  // • Автоматично стискає текстові типи (json/html/css/js/svg) -->
  //   в рази менший об’єм, швидше завантаження.
  // • Зчитує Accept-Encoding клієнта, тому прозоро для коду.
  app.use(compression());

  // express-rate-limit  ➜  Захист від brute/DDoS
  app.use(dynamicRateLimit);

  app.use(logger());

  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(scopePerRequest);

  if (config.env === 'development') {
    const spec = createZodSpec();

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
    console.log(`Swagger docs → ${config.baseUrl}/docs`);
  }

  // Register brew routes
  app.use('/api', brewRouter);

  app.use(notFound);

  app.use(errorHandler());

  return app;
};

export { createApp };
