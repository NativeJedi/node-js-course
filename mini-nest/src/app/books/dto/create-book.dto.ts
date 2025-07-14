import { z } from 'zod';

const createBookSchema = z
  .object({
    title: z.string(),
  })
  .required();

type CreateBookDto = z.infer<typeof createBookSchema>;

export { createBookSchema, CreateBookDto };
