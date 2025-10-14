/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class updateUserDto {
  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  email!: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword()
  password!: string;
}
