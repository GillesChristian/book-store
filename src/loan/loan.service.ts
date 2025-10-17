import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Loan, LoanByBook, LoanByUser } from './types/loan.types';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UsersService } from '../users/users.service';
import { BookService } from '../book/book.service';

const loanSelect = {
  id: true,
  loanDate: true,
  returnDate: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, email: true, name: true } },
  book: { select: { id: true, title: true, author: true, description: true } },
};

@Injectable()
export class LoanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly bookService: BookService,
  ) {}

  /**
   * Check if loan exists by ID
   * @param id - UUID of the loan
   * @returns True if loan exists, false otherwise
   */
  async loanExists(id: string): Promise<boolean> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return !!loan;
  }

  /**
   * Check if loan exists by userId and bookId before creating a loan
   * @param userId - UUID of the user
   * @param bookId - UUID of the book
   */
  async loanExistsByUserAndBook(userId: string, bookId: string): Promise<void> {
    const loan = await this.prisma.loan.findFirst({
      where: { userId, bookId, returnDate: null },
      select: { id: true },
    });

    if (loan) {
      throw new ConflictException(
        `User with ID ${userId} already has an active loan for book ID ${bookId}`,
      );
    }
  }

  /**
   * Retrieve all loans from the database
   * @returns Array of all loans
   */
  async getLoans(): Promise<Loan[]> {
    return this.prisma.loan.findMany({
      select: loanSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve a single loan by ID
   * @param id - UUID of the loan
   * @throws NotFoundException if loan doesn't exist
   */
  async getLoanById(id: string): Promise<Loan> {
    await this.loanExists(id);

    return this.prisma.loan.findUnique({
      where: { id },
      select: loanSelect,
    }) as Promise<Loan>;
  }

  /**
   * Retrieve loans by user ID
   * @param userId - UUID of the user
   * @returns Array of loans for the user
   */
  async getLoansByUserId(userId: string): Promise<LoanByUser[]> {
    await this.usersService.userExists(userId);

    return this.prisma.loan.findMany({
      where: { userId },
      select: {
        id: true,
        loanDate: true,
        returnDate: true,
        createdAt: true,
        updatedAt: true,
        book: {
          select: { id: true, title: true, author: true, description: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve all loans for a specific book
   * @param bookId - UUID of the book
   * @returns Array of loans for the book
   */
  async getLoansByBookId(bookId: string): Promise<LoanByBook[]> {
    await this.bookService.getBookById(bookId);

    return this.prisma.loan.findMany({
      where: { bookId },
      select: {
        id: true,
        loanDate: true,
        returnDate: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve active loans (not yet returned)
   * @returns Array of active loans
   */
  async getActiveLoans(): Promise<Loan[]> {
    return this.prisma.loan.findMany({
      where: { returnDate: null },
      select: loanSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new loan
   * @param userId - UUID of the user
   * @param bookId - UUID of the book
   * @returns The created loan
   */
  async createLoan(createLoanDto: CreateLoanDto): Promise<Loan> {
    const { userId, bookId } = createLoanDto;

    await this.usersService.userExists(userId);
    await this.bookService.checkBookAvailability(bookId);
    await this.loanExistsByUserAndBook(userId, bookId);

    const [loan, bookUpdate] = await this.prisma.$transaction([
      this.prisma.loan.create({
        data: {
          userId,
          bookId,
          loanDate: new Date(),
        },
        select: loanSelect,
      }),
      this.prisma.book.updateMany({
        where: { id: bookId, available: true },
        data: { available: false },
      }),
    ]);

    if (bookUpdate.count === 0) {
      throw new ConflictException(
        `Book with ID ${bookId} is no longer available`,
      );
    }

    return loan;
  }

  /**
   * Mark a loan as returned
   * @param id - UUID of the loan
   * @returns The updated loan
   */
  async returnLoan(id: string): Promise<Loan> {
    await this.loanExists(id);
    const loan = await this.getLoanById(id);

    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id },
        data: { returnDate: new Date() },
        select: loanSelect,
      }),
      this.prisma.book.update({
        where: { id: loan.book.id },
        data: { available: true },
      }),
    ]);

    return updatedLoan;
  }
}
