import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Book } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book-dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve all books from the database
   * @returns Array of all books
   */
  async getBooks(): Promise<Book[]> {
    return this.prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve a single book by ID
   * @param id - UUID of the book
   * @throws NotFoundException if book doesn't exist
   */
  async getBookById(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  /**
   * Retrieve all available books
   * @returns Array of available books (empty array if none found)
   */
  async getAvailableBooks(): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { available: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve books by author
   * @param author - Author name to search for
   * @returns Array of books by the author (empty array if none found)
   */
  async getBooksByAuthor(author: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        author: {
          contains: author,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Search books by title or description
   * @param searchTerm - Term to search for
   * @returns Array of matching books (empty array if none found)
   */
  async searchBooks(searchTerm: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            description: {
              contains: searchTerm,
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  /**
   * Check if a book with the same title and author exists
   * @param author - Author name
   * @param title - Book title
   * @returns The existing book or null if not found
   */
  async bookExists(author: string, title: string): Promise<Book | null> {
    return this.prisma.book.findFirst({
      where: {
        author,
        title,
      },
    });
  }

  /**
   * Create a new book
   * @param data - Book creation data
   * @throws ConflictException if book with same title and author exists
   */
  async createBook(data: CreateBookDto): Promise<Book> {
    const bookExists = await this.bookExists(data.author, data.title);

    if (bookExists) {
      throw new ConflictException(
        `Book with title "${data.title}" by author "${data.author}" already exists`,
      );
    }
    return this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        available: data.available ?? true,
      },
    });
  }

  /**
   * Update an existing book
   * @param id - UUID of the book to update
   * @param data - Partial book data to update
   * @throws NotFoundException if book doesn't exist
   */
  async updateBook(id: string, data: UpdateBookDto): Promise<Book> {
    await this.getBookById(id);

    return this.prisma.book.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  /**
   * Delete a book
   * @param id - UUID of the book to delete
   * @throws NotFoundException if book doesn't exist
   */
  async deleteBook(id: string): Promise<void> {
    await this.getBookById(id);

    await this.prisma.book.delete({
      where: { id },
    });
  }

  /**
   * Toggle book availability
   * @param id - UUID of the book to toggle
   * @throws NotFoundException if book doesn't exist
   */
  async toggleBookAvailability(id: string): Promise<Book> {
    const book = await this.getBookById(id);

    return this.prisma.book.update({
      data: { available: !book.available },
      where: { id },
    });
  }
}
