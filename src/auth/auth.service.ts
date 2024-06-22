import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SendMailsService } from 'src/config/email/sendMail.service';
import { handleResponse } from 'src/utils/responseHandler';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import config from '../config/key';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly sendMail: SendMailsService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.user.create({
      data: {
        ...createAuthDto,
      },
    });

    const to = config.recipient;
    const subject = 'New User Submission';
    const template = 'activateAcct';
    const context = {
      email: user.email_address,
      password: user.password,
    };

    await this.sendMail.sendVerificationEmail(to, subject, template, context);

    delete user.password;
    delete user.Otp;

    return new handleResponse(
      HttpStatus.CREATED,
      'User Created Successfully',
      user,
    );
  }

  async getOtp(otpDto: UpdateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { userid: otpDto.userid },
    });

    if (!user) {
      return new handleResponse(HttpStatus.NOT_FOUND, 'User not found');
    }

    await this.prisma.user.update({
      where: { userid: otpDto.userid },
      data: { Otp: otpDto.otp },
    });

    const to = config.recipient;
    const subject = 'New Otp Submission';
    const template = 'newOtp';
    const context = {
      email: user.email_address,
      otp: user.Otp,
    };

    await this.sendMail.sendVerificationEmail(to, subject, template, context);

    delete user.password;
    delete user.Otp;

    return new handleResponse(HttpStatus.OK, 'OTP updated successfully');
  }
}
