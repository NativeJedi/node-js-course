import { AppError } from '../utils/errors.js';

class BrewController {
  constructor({ brewService }) {
    this.brewService = brewService;
  }

  index = (_req, res) => {
    res.json(this.brewService.getAll(_req.validatedQuery));
  };

  getOne = (req, res) => {
    const brew = this.brewService.getOne(req.params.id);

    if (!brew) {
      new AppError('Brew not found', 404);
      return;
    }

    res.json(brew);
  };

  create = (req, res) => {
    res.status(201).json(this.brewService.create(req.body));
  };

  update = (req, res) => {
    const brew = this.brewService.update(req.params.id, req.body);

    if (!brew) {
      new AppError('Brew not found', 404);
      return;
    }

    res.json(brew);
  };

  remove = (req, res) => {
    const isDeleted = this.brewService.delete(req.params.id);

    if (!isDeleted) {
      new AppError('Brew not found', 404);
      return;
    }

    res.status(204).end();
  };
}

export { BrewController };
