import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IMailProvider, SendMailOptions } from '../core/mail.interface';
import { AllConfigType } from '@/config';

@Injectable()
export class NodemailerProvider implements IMailProvider, OnModuleInit {
  private readonly logger = new Logger(NodemailerProvider.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private defaultFrom: string;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.defaultFrom =
      this.configService.get('mail.defaultFrom', { infer: true }) ||
      'noreply@yourdomain.com';

    const smtpConfig = this.configService.get('mail.smtp', { infer: true });

    this.transporter = nodemailer.createTransport({
      host: smtpConfig?.host,
      port: smtpConfig?.port,
      secure: smtpConfig?.port === 465, // true for 465, false for other ports
      auth: {
        user: smtpConfig?.user,
        pass: smtpConfig?.pass,
      },
    });
  }

  async onModuleInit() {
    try {
      const provider = this.configService.get('mail.provider', { infer: true });
      // Only verify connection if we are actually using nodemailer
      if (provider === 'nodemailer') {
        await this.transporter.verify();
        this.logger.log('Nodemailer successfully connected to SMTP server');
      }
    } catch (error) {
      this.logger.error(
        `Failed to connect to SMTP server: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      this.logger.debug(`Nodemailer Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(
        `Nodemailer Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
