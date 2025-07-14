import { Controller } from '../../core/decorators/controller';
import { Delete, Get, Patch, Post, Put } from '../../core/decorators/route';
import { BooksService } from './books.service';
import { Param } from '../../core/decorators/param';
import { Body } from '../../core/decorators/body';
import { Book } from './books.entity';
import { Query } from '../../core/decorators/query';
import { UsePipes } from '../../core/decorators/use-pipes';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { CreateBookDto, createBookSchema } from './dto/create-book.dto';
import { UseGuards } from '../../core/decorators/use-guards';
import { Private } from '../guards/private.guard';
import { UseFilters } from '../../core/decorators/use-filters';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('/books')
class BooksController {
  constructor(private svc: BooksService) {}

  @Get()
  list(@Query('title') title?: string) {
    return this.svc.findAll({ title });
  }

  @UseFilters(HttpExceptionFilter)
  @Get('/:id')
  one(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @UseGuards(Private)
  @UsePipes(new ZodValidationPipe(createBookSchema))
  @Post()
  add(@Body() book: CreateBookDto) {
    return this.svc.create(book);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.svc.delete(+id);
  }

  @Put('/:id')
  replaceOne(@Param('id') id: string, @Body() book: Omit<Book, 'id'>) {
    return this.svc.replaceOne(+id, book);
  }

  @Patch('/:id')
  updateOne(@Param('id') id: string, @Body() book: Omit<Book, 'id'>) {
    return this.svc.updateOne(+id, book);
  }
}

export { BooksController };
