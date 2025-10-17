import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { BookService } from 'src/book/book.service';
import { LoanController } from './loan.controller';

@Module({
  providers: [LoanService, PrismaService, UsersService, BookService],
  controllers: [LoanController],
})
export class LoanModule {}
