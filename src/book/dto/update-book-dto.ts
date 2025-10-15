/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
