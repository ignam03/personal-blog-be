import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(email: string, name: string, token: string) {
    try {
      const url = `${process.env.FRONTEND_ENDPOINT}confirm-account/${token}`;
      await this.mailService.sendMail({
        to: email,
        subject: 'Welcome to Nice App! Confirm your Email',
        template: 'confirmation',
        context: {
          name,
          url,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendPasswordReset(email: string, name: string, token: string) {
    try {
      const url = `${process.env.FRONTEND_ENDPOINT}new-password/${token}`;
      await this.mailService.sendMail({
        to: email,
        subject: 'Reset your Password',
        template: 'reset',
        context: {
          name,
          url,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
