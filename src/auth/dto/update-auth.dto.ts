import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class UpdateAuthDto {
  @ApiProperty({ example: 'john@example.com', required: true })
  @IsString()
  userid: string;

  @ApiProperty({ example: '342214', required: true })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
