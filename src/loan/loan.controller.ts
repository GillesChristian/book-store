/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Loan, LoanByBook, LoanByUser } from './types/loan.types';
import { LoanService } from './loan.service';
import { formatResponse } from 'src/utils/helpers';
import { CreateLoanDto } from './dto/create-loan.dto';

@Controller('api/v1/loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get()
  async getLoans() {
    const loans = await this.loanService.getLoans();

    return formatResponse<Loan[]>(loans ?? []);
  }

  @Get('active')
  async getActiveLoans() {
    const loans = await this.loanService.getActiveLoans();

    return formatResponse<Loan[]>(loans ?? []);
  }

  @Get(':userId/users')
  async getUserLoans(@Param('userId', ParseUUIDPipe) userId: string) {
    const loans = await this.loanService.getLoansByUserId(userId);

    return formatResponse<LoanByUser[]>(loans ?? []);
  }

  @Get(':bookId/books')
  async getBookLoans(@Param('bookId', ParseUUIDPipe) bookId: string) {
    const loans = await this.loanService.getLoansByBookId(bookId);

    return formatResponse<LoanByBook[]>(loans ?? []);
  }

  @Get(':id')
  async getLoan(@Param('id', ParseUUIDPipe) id: string) {
    const loan = await this.loanService.getLoanById(id);

    return formatResponse<Loan>(loan);
  }

  @Post()
  async createLoan(@Body() data: CreateLoanDto) {
    const loan = await this.loanService.createLoan(data);

    return formatResponse<Loan>(loan);
  }

  @Patch(':id/return')
  async returnLoan(@Param('id', ParseUUIDPipe) id: string) {
    const loan = await this.loanService.returnLoan(id);

    return formatResponse<Loan>(loan);
  }
}
