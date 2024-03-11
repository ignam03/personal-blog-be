import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.develop.env',
});

const configService = new ConfigService();
@Module({
  controllers: [],
  imports: [
    MailerModule.forRoot({
      transport: {
        service: configService.get<string>('EMAIL_SERVICE'),
        host: configService.get<string>('EMAIL_HOST'),
        port: parseInt(configService.get<string>('EMAIL_PORT')) || 465,
        secure: true,
        auth: {
          user: configService.get<string>('EMAIL_USER'),
          pass: configService.get<string>('EMAIL_PASS'),
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname) + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
