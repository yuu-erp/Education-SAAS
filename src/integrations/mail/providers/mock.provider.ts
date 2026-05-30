import { Injectable, Logger } from '@nestjs/common';
import { IMailProvider, SendMailOptions } from '../core/mail.interface';

@Injectable()
export class MockMailProvider implements IMailProvider {
  private readonly logger = new Logger(MockMailProvider.name);

  async sendMail(options: SendMailOptions): Promise<void> {
    this.logger.log('--- MOCK EMAIL SENT ---');
    this.logger.log(
      `To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
    );
    this.logger.log(`Subject: ${options.subject}`);
    if (options.text) {
      this.logger.log(`Text Body: ${options.text.substring(0, 50)}...`);
    }
    if (options.html) {
      this.logger.log(`HTML Body Length: ${options.html.length} chars`);
    }
    this.logger.log('-----------------------');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
