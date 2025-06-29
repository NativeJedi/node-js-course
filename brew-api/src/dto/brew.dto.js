import { z } from 'zod';
import { registry } from '../docs/registry.js';

const methodValidation = z.enum(['v60', 'aeropress', 'chemex', 'espresso']);

const BrewDTO = z.object({
  beans: z.string().min(3, 'Min length is 3').max(40, 'Max length is 40'),
  method: methodValidation,
  rating: z
    .number()
    .min(1, 'Min rating is 1')
    .max(5, 'Max rating is 5')
    .optional(),
  notes: z.string().max(200, 'Max length is 200').optional(),
});

registry.register('Brew', BrewDTO);

export { BrewDTO, methodValidation };
