import { Injectable } from '../../core/decorators/injectable';
import { Book } from './books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { NotFoundError } from '../../core/errors';

@Injectable()
class BooksService {
  #data: Book[] = [{ id: 1, title: '1984' }];

  findAll(filter: { title?: string } = {}) {
    if (filter.title) {
      return this.#data.filter((b) => b.title.includes(filter.title!));
    }

    return this.#data;
  }

  findOne(id: number) {
    const book = this.#data.find((b) => b.id === id);

    if (!book) {
      throw new NotFoundError();
    }

    return book;
  }

  create(bookData: CreateBookDto): Book {
    const book = { id: this.#data.length + 1, ...bookData };

    this.#data.push(book);

    return book;
  }

  delete(id: number): Book {
    const index = this.#data.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new NotFoundError();
    }

    return this.#data.splice(index, 1)[0];
  }

  replaceOne(id: number, bookData: Omit<Book, 'id'>): Book {
    const index = this.#data.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new NotFoundError();
    }

    const updated = {
      ...bookData,
      id,
    };

    this.#data[index] = updated;

    return updated;
  }

  updateOne(id: number, bookData: Omit<Book, 'id'>): Book {
    const index = this.#data.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new NotFoundError();
    }

    const existingBook = this.#data[index];

    const updated = {
      ...existingBook,
      ...bookData,
      id: existingBook.id,
    };

    this.#data[index] = updated;

    return updated;
  }
}

export { BooksService };
