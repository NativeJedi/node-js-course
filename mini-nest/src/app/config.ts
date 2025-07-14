import { z } from 'zod';

const appConfigSchema = z.object({
  ROLE_HEADER: z.string().default('x-role'),
});

type AppConfig = z.infer<typeof appConfigSchema>;

export { appConfigSchema, AppConfig };
