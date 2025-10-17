import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [PrismaModule, UsersModule, BookModule, LoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
