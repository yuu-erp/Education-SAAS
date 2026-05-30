import { Module, Provider, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config';
import { MailService, MAIL_PROVIDER } from './core/mail.service';
import { MockMailProvider } from './providers/mock.provider';
import { ResendMailProvider } from './providers/resend.provider';
import { NodemailerProvider } from './providers/nodemailer.provider';
import { MailController } from './mail.controller';

const MailProviderFactory: Provider = {
  provide: MAIL_PROVIDER,
  useFactory: (
    configService: ConfigService<AllConfigType>,
    mockProvider: MockMailProvider,
    resendProvider: ResendMailProvider,
    nodemailerProvider: NodemailerProvider,
  ) => {
    const provider = configService.get('mail.provider', { infer: true });
    if (provider === 'resend') {
      return resendProvider;
    }
    if (provider === 'nodemailer') {
      return nodemailerProvider;
    }
    // Default to mock provider
    return mockProvider;
  },
  inject: [
    ConfigService,
    MockMailProvider,
    ResendMailProvider,
    NodemailerProvider,
  ],
};

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [MailController],
  providers: [
    MockMailProvider,
    ResendMailProvider,
    NodemailerProvider,
    MailProviderFactory,
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
