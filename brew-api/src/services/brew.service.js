const filters = {
  ratingMin: (brews, value) => brews.filter((brew) => brew.rating >= value),
  method: (brews, value) => brews.filter((brew) => brew.method === value),
};

const filterBrewsByQuery = (brews, query) => {
  return Object.entries(filters).reduce((filteredBrews, [fName, filter]) => {
    const isFilterActive = fName in query;

    if (isFilterActive) {
      return filter(filteredBrews, query[fName]);
    }

    return filteredBrews;
  }, brews);
};

export class BrewService {
  constructor({ brewModel }) {
    this.brewModel = brewModel;
  }

  getAll(query) {
    const brews = this.brewModel.getAll();

    return filterBrewsByQuery(brews, query);
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
