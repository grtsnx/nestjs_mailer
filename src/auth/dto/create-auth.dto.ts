import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';
export class CreateAuthDto {
  @ApiProperty({ example: 'john@example.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  email_address: string;

  @ApiProperty({ example: 'password123', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
