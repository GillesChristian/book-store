import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import type { Book } from 'generated/prisma';
import { formatResponse } from 'src/utils/helpers';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('api/v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  // private readonly logger = new Logger(BookController.name);

  @Get()
  async getBooks() {
    const books = await this.bookService.getBooks();

    return formatResponse<Book[]>(books ?? []);
  }

  @Get('available')
  async getAvailableBooks() {
    const books = await this.bookService.getAvailableBooks();

    return formatResponse<Book[]>(books ?? []);
  }

  @Get('search')
  async searchBooks(@Query('search_term') searchTerm: string) {
    const books = await this.bookService.searchBooks(searchTerm);

    return formatResponse<Book[]>(books ?? []);
  }

  @Get(':id')
  async getBookById(@Param('id', ParseUUIDPipe) id: string) {
    const book = await this.bookService.getBookById(id);

    return formatResponse<Book>(book);
  }

  @Get('author/:author')
  async getBooksByAuthor(@Param('author') author: string) {
    const books = await this.bookService.getBooksByAuthor(author);

    return formatResponse<Book[]>(books ?? []);
  }

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.createBook(createBookDto);

    return formatResponse<Book>(book);
  }

  @Put(':id')
  async updateBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: Partial<CreateBookDto>,
  ) {
    const book = await this.bookService.updateBook(id, updateBookDto);

    return formatResponse<Book>(book);
  }

  @Delete(':id')
  async deleteBook(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookService.deleteBook(id);

    return formatResponse({
      message: `Book with ID ${id} deleted successfully`,
    });
  }

  @Patch(':id/availability')
  async toggleBookAvailability(@Param('id', ParseUUIDPipe) id: string) {
    const book = await this.bookService.toggleBookAvailability(id);

    return formatResponse<Book>(book);
  }
}
