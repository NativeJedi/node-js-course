export class BrewService {
  constructor({ brewModel }) {
    this.brewModel = brewModel;
  }

  getAll() {
    return this.brewModel.getAll();
  }

  getOne(id) {
    return this.brewModel.find(id);
  }

  create(dto) {
    return this.brewModel.create(dto);
  }

  update(id, dto) {
    return this.brewModel.update(id, dto);
  }

  delete(id) {
    return this.brewModel.remove(id);
  }
}
