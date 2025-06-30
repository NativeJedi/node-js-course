import { Router } from 'express';
import { z } from 'zod';
import { makeInvoker } from '../middlewares/makeInvoker.js';
import { validate } from '../middlewares/validate.js';
import {
  BrewDTO,
  methodValidation,
  ratingValidation,
} from '../dto/brew.dto.js';
import { validateParams } from '../middlewares/validateParams.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { registry } from '../docs/registry.js';

const brewRouter = Router();

const paramsSchema = z.object({
  id: z.string().describe('Brew ID'),
});

const filterParamsSchema = z.object({
  method: methodValidation.optional().describe('Brew method'),
  ratingMin: ratingValidation.describe('Brew rating'),
});

const ctl = makeInvoker('brewController');

brewRouter.get('/brews', validateQuery(filterParamsSchema), ctl('index'));
registry.registerPath({
  method: 'get',
  path: '/api/brews',
  tags: ['Brews'],
  request: {
    query: filterParamsSchema,
  },
  responses: {
    200: {
      description: 'Array of brews',
      content: { 'application/json': { schema: z.array(BrewDTO) } },
    },
  },
});

brewRouter.get('/brews/:id', validateParams(paramsSchema), ctl('getOne'));
registry.registerPath({
  method: 'get',
  path: '/api/brews/{id}',
  tags: ['Brews'],
  request: { params: paramsSchema },
  responses: {
    200: {
      description: 'Brew',
      content: { 'application/json': { schema: BrewDTO } },
    },
    404: { description: 'Brew not found' },
  },
});

brewRouter.post('/brews', validate(BrewDTO), ctl('create'));
registry.registerPath({
  method: 'post',
  path: '/api/brews',
  tags: ['Brews'],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: BrewDTO } },
    },
  },
  responses: {
    201: {
      description: 'Created',
      content: { 'application/json': { schema: BrewDTO } },
    },
    400: { description: 'Validation error' },
  },
});

brewRouter.put(
  '/brews/:id',
  validateParams(paramsSchema),
  validate(BrewDTO),
  ctl('update')
);
registry.registerPath({
  method: 'put',
  path: '/api/brews/{id}',
  tags: ['Brews'],
  request: {
    params: paramsSchema,
    body: {
      required: true,
      content: { 'application/json': { schema: BrewDTO } },
    },
  },
  responses: {
    200: {
      description: 'Updated brew',
      content: { 'application/json': { schema: BrewDTO } },
    },
    400: { description: 'Validation error' },
    404: { description: 'Brew not found' },
  },
});

brewRouter.delete('/brews/:id', validateParams(paramsSchema), ctl('remove'));
registry.registerPath({
  method: 'delete',
  path: '/api/brews/{id}',
  tags: ['Brews'],
  request: { params: paramsSchema },
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Brew not found' },
  },
});

export { brewRouter };
