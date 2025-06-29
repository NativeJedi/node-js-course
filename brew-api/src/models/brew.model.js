import { nanoid } from 'nanoid';

class BrewModel {
  #store = new Map();

  getAll() {
    return [...this.#store.values()];
  }

  find(id) {
    return this.#store.get(id) ?? null;
  }

  create(dto) {
    const id = nanoid();
    const brew = { id, ...dto };
    this.#store.set(id, brew);
    console.log(this.#store);
    return brew;
  }

  update(id, dto) {
    if (!this.#store.has(id)) return null;
    const brew = { id, ...dto };
    this.#store.set(id, brew);
    return brew;
  }

  remove(id) {
    return this.#store.delete(id);
  }
}

export { BrewModel };
