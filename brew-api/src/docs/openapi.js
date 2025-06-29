import { registry } from './registry.js';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { config } from '../config/index.js';

export const createZodSpec = () => {
  const zodSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument(
    {
      openapi: '3.0.0',
      info: {
        title: config.appName,
        version: config.appVersion,
      },
    }
  );

  return zodSpec;
};
