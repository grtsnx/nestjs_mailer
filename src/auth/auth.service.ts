import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SendMailsService } from 'src/config/email/sendMail.service';
import { handleResponse } from 'src/utils/responseHandler';
import { CreateAuthDto } from './dto/create-auth.dto';

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

    const to = 'Javon0165@yahoo.com';
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
}
