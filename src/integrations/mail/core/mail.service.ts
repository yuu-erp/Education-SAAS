import { Injectable, Inject, Logger } from '@nestjs/common';
import * as mailInterface from './mail.interface';

export const MAIL_PROVIDER = 'MAIL_PROVIDER';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: mailInterface.IMailProvider,
  ) {}

  async sendMail(options: mailInterface.SendMailOptions): Promise<void> {
    try {
      this.logger.debug(
        `Sending email to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
      );
      await this.mailProvider.sendMail(options);
      this.logger.log(
        `Successfully sent email to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
      );
      // Re-throw or handle based on business requirement.
      // For MVP, we might throw so the caller knows it failed, or just swallow if we don't want to break the request.
      throw error;
    }
  }
}
