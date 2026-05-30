import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMailProvider, SendMailOptions } from '../core/mail.interface';
import { AllConfigType } from '@/config';

@Injectable()
export class ResendMailProvider implements IMailProvider {
  private readonly logger = new Logger(ResendMailProvider.name);
  private resend: Resend;
  private defaultFrom: string;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const apiKey = this.configService.get('mail.resendApiKey', { infer: true });
    this.defaultFrom =
      this.configService.get('mail.defaultFrom', { infer: true }) ||
      'noreply@yourdomain.com';

    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn(
        'Resend API key is not configured. Emails will fail if not using Mock Provider.',
      );
      this.resend = new Resend('dummy-key');
    }
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const baseOptions = {
      from: options.from || this.defaultFrom,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
    };

    let payload: import('resend').CreateEmailOptions;

    if (options.html && options.text) {
      payload = { ...baseOptions, html: options.html, text: options.text };
    } else if (options.html) {
      payload = { ...baseOptions, html: options.html };
    } else if (options.text) {
      payload = { ...baseOptions, text: options.text };
    } else {
      throw new Error('Either html or text must be provided to send an email.');
    }

    const { data, error } = await this.resend.emails.send(payload);

    if (error) {
      this.logger.error(`Resend API Error: ${error.message}`, error);
      throw new Error(error.message);
    }

    if (data) {
      this.logger.debug(`Resend Email ID: ${data.id}`);
    }
  }
}
