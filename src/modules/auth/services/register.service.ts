import { AllConfigType } from '@/config';
import { PrismaService } from '@/database';
import { MailService } from '@/integrations/mail/core/mail.service';
import { OtpEmailTemplate } from '@/integrations/mail/templates/auth/otp-email.template';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpType } from '@prisma/prisma/enums';
import { render } from '@react-email/render';
import * as argon2 from 'argon2';
import { RegisterDto } from '../dto';
import { OtpService } from './otp.service';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; email: string }> {
    this.logger.log(`[AUTH] REGISTER attempt: ${registerDto.email}`);

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);
    // Generate OTP (Secure Token for Magic Link)

    const { user, token } = await this.prismaService.$transaction(
      async (tx) => {
        // 1. Create User
        const user = await tx.user.create({
          data: {
            email: registerDto.email,
            passwordHash,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            // emailVerified is false by default
          },
        });

        const token = await this.otpService.generateOtp(
          user.id,
          OtpType.EMAIL_VERIFICATION,
          tx,
        );

        return {
          user,
          token,
        };
      },
    );

    const frontendDomain = this.configService.get('app.frontendDomain', {
      infer: true,
    });
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
      subject: 'Welcome! Please verify your email',
      html,
    });

    return {
      message: 'Registration successful. Please verify your email.',
      email: user.email,
    };
  }
}
