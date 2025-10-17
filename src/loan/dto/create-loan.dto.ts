import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  bookId: string;
}
