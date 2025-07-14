import dotenv from 'dotenv';
import { CONFIG_TOKEN } from './decorators/config';
import { container } from './container';

class ConfigModule {
  static forRoot(options: { schema: any }) {
    dotenv.config();

    const result = options.schema.safeParse(process.env);

    if (!result.success) {
      console.error('Invalid environment variables:', result.error.format());
      throw new Error('Config validation error');
    }

    const validatedConfig = result.data;

    container.register(CONFIG_TOKEN, validatedConfig);
  }
}

export { ConfigModule };
