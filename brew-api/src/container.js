import { asClass, createContainer } from 'awilix';
import { BrewController } from './controllers/brew.controller.js';
import { BrewService } from './services/brew.service.js';
import { BrewModel } from './models/brew.model.js';

/**
 * injectionMode: ‘CLASSIC’ означає:
 * Awilix дивиться імена параметрів конструктора і підставляє
 * відповідні реєстраційні токени.
 */
export const container = createContainer({
  injectionMode: 'PROXY',
}).register({
  brewController: asClass(BrewController).scoped(),
  brewService: asClass(BrewService).scoped(),
  brewModel: asClass(BrewModel).singleton(),
});
