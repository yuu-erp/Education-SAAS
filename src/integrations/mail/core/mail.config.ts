import { registerAs } from '@nestjs/config';

export type MailConfig = {
  provider: 'resend' | 'nodemailer' | 'mock';
  defaultFrom: string;
  resendApiKey?: string;
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
};

export default registerAs<MailConfig>('mail', () => ({
  provider:
    (process.env.MAIL_PROVIDER as 'resend' | 'nodemailer' | 'mock') || 'mock',
  defaultFrom: process.env.MAIL_DEFAULT_FROM || 'noreply@yourdomain.com',
  resendApiKey: process.env.RESEND_API_KEY,
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
}));
