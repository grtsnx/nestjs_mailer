import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SendMailsService } from './sendMail.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule global
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILBBY_SMTP'),
          port: configService.get<number>('MAILBBY_PORT'),
          secure: true,
          // service: 'gmail', // in case we want to switch to Gmail SMTP
          auth: {
            user: configService.get<string>('MAILBBY_USERNAME'),
            pass: configService.get<string>('MAILBBY_PASSWORD'),
          },
        },
        defaults: {
          from: {
            name: configService.get<string>('PLATFORM'),
            address: configService.get<string>('AUTHSENDER'),
          },
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [SendMailsService],
  providers: [SendMailsService],
})
export class SendMailsModule {}
