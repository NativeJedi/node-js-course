import { z } from 'zod';

export const TeaSchema = z.object({
  name: z.string().min(3).max(40),
  origin: z.string().min(2).max(30).nullable().default(null),
  rating: z.number().min(0).max(10).nullable().default(null),
  temp: z.number().min(60).max(100).nullable().default(null),
  notes: z.string().max(150).nullable().default(null),
});

export const UpdateTeaSchema = TeaSchema.partial();
