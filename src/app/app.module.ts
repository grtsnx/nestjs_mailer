import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { SendMailsModule } from 'src/config/email/sendMail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    SendMailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
