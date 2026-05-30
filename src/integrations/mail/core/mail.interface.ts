export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface IMailProvider {
  sendMail(options: SendMailOptions): Promise<void>;
}
