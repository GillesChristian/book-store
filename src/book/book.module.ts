import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookController } from './book.controller';

@Module({
  providers: [BookService, PrismaService],
  controllers: [BookController],
})
export class BookModule {}
