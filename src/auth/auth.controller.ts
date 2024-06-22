import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to Account' })
  @Post('/signin')
  loginUser(@Body() loginAuthDto: CreateAuthDto) {
    return this.authService.create(loginAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Otp' })
  @Patch('/otp')
  getOtp(@Body() otpDto: UpdateAuthDto) {
    return this.authService.getOtp(otpDto);
  }
}
