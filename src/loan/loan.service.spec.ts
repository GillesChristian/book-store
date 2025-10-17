import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { BookService } from '../book/book.service';
import { ConflictException } from '@nestjs/common';

describe('LoanService', () => {
  let service: LoanService;

  // Mocks for dependencies
  const prismaMock = {
    loan: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    book: {
      updateMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const usersServiceMock = {
    userExists: jest.fn(),
  };

  const bookServiceMock = {
    checkBookAvailability: jest.fn(),
    getBookById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: BookService, useValue: bookServiceMock },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLoan', () => {
    const createLoanDto = { userId: 'user1', bookId: 'book1' };

    it('should create a loan successfully', async () => {
      usersServiceMock.userExists.mockResolvedValue(true);
      bookServiceMock.checkBookAvailability.mockResolvedValue(undefined);
      prismaMock.loan.findFirst.mockResolvedValue(null);
      prismaMock.$transaction.mockResolvedValue([
        { id: 'loan1', userId: 'user1', bookId: 'book1', loanDate: new Date() },
        { count: 1 },
      ]);

      const result = await service.createLoan(createLoanDto);

      expect(usersServiceMock.userExists).toHaveBeenCalledWith('user1');
      expect(bookServiceMock.checkBookAvailability).toHaveBeenCalledWith(
        'book1',
      );
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'loan1');
    });

    it('should throw ConflictException if book is no longer available', async () => {
      usersServiceMock.userExists.mockResolvedValue(true);
      bookServiceMock.checkBookAvailability.mockResolvedValue(undefined);
      prismaMock.loan.findFirst.mockResolvedValue(null);
      prismaMock.$transaction.mockResolvedValue([
        { id: 'loan1', userId: 'user1', bookId: 'book1', loanDate: new Date() },
        { count: 0 },
      ]);

      await expect(service.createLoan(createLoanDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // Additional tests for other methods can be added here...
});
