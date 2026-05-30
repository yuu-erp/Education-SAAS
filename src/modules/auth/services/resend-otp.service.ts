import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config';
import { PrismaService } from '@/database';
import { OtpService } from './otp.service';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { MailService } from '@/integrations/mail/core/mail.service';
import { render } from '@react-email/render';
import { OtpEmailTemplate } from '@/integrations/mail/templates/auth/otp-email.template';

@Injectable()
export class ResendOtpService {
  private readonly logger = new Logger(ResendOtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {
    const { email, type } = resendOtpDto;

    // Log carefully to avoid enumeration
    this.logger.log(`[AUTH] RESEND OTP attempt: ${email} for type ${type}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Generate OTP and invalidate old ones
      const token = await this.otpService.generateOtp(
        user.id,
        type,
        this.prisma,
      );

      const frontendDomain =
        this.configService.get('app.frontendDomain', { infer: true }) ||
        'http://localhost:3000';
      const verificationLink = `${frontendDomain}/auth/verify-email?email=${encodeURIComponent(user.email)}&token=${token}`;

      // Render email using React Email
      const html = await render(
        OtpEmailTemplate({
          firstName: user.firstName || 'User',
          verificationLink,
          organizationName: 'Education SAAS',
        }),
      );

      // Send email
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Your Verification Code',
        html,
      });
    }

    // Always return generic success message to prevent email enumeration
    return {
      message: 'If your email is registered, you will receive an OTP shortly.',
    };
  }
}
