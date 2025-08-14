import { Injectable, NotFoundException } from '@nestjs/common';
import { Tea } from './entities/tea.entity';
import { TeaQuery } from './dto/tea-query.dto';
import { PaginatedTeaResponse } from './dto/tea-response.dto';

const filterByRating = (teas: Tea[], minRating: number) =>
  teas.filter(({ rating }) => rating && rating >= minRating);

const paginateData = <T = unknown>(data: T[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return data.slice(start, end);
};

@Injectable()
export class TeasService {
  private teas: Tea[] = [];

  async getAll({
    page,
    minRating,
    limit,
  }: TeaQuery): Promise<PaginatedTeaResponse> {
    const teas = minRating ? filterByRating(this.teas, minRating) : this.teas;

    const data = paginateData<Tea>(teas, page, limit);

    return {
      data,
      total: teas.length,
      page,
      pageSize: limit,
      totalPages: Math.ceil(teas.length / limit),
    };
  }

  async getOne(id: number): Promise<Tea> {
    const tea = this.teas.find((t) => t.id === id);

    if (!tea) {
      throw new NotFoundException();
    }

    return tea;
  }

  async create(tea: Omit<Tea, 'id'>): Promise<Tea> {
    const newTea = { ...tea, id: Date.now() };
    this.teas.push(newTea);
    return newTea;
  }

  async update(id: number, tea: Partial<Tea>): Promise<Tea> {
    const index = this.teas.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException();
    }

    const updatedTea = { ...this.teas[index], ...tea, id };

    this.teas[index] = updatedTea;

    return updatedTea;
  }

  async remove(id: number): Promise<void> {
    const index = this.teas.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException();
    }

    this.teas.splice(index, 1);
  }

  onApplicationShutdown(signal: 'SIGINT') {
    if (signal === 'SIGINT') {
      console.log('Bye tea‑lovers 👋');
    }
  }
}
