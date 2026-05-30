import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config';
import { PrismaService } from '@/database';
import { Role } from '@prisma/prisma/enums';
import * as argon2 from 'argon2';
import { RegisterDto } from '../dto';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { MailService } from '@/integrations/mail/core/mail.service';
import { render } from '@react-email/render';
import { OtpEmailTemplate } from '@/integrations/mail/templates/auth/otp-email.template';
import { OtpType } from '@prisma/prisma/enums';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; email: string }> {
    this.logger.log(`[AUTH] REGISTER attempt: ${registerDto.email}`);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    // Default organization slug generation
    const slug =
      `${registerDto.firstName}-${registerDto.lastName}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: `${registerDto.firstName}'s Organization`,
          slug,
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          email: registerDto.email,
          passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          // emailVerified is false by default
        },
      });

      // 3. Create Membership (assign OWNER role)
      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: Role.OWNER,
        },
      });

      return { user, organization };
    });

    // Generate OTP (Secure Token for Magic Link)
    const token = await this.otpService.generateOtp(
      result.user.id,
      OtpType.EMAIL_VERIFICATION,
    );

    console.log('token', token);

    const frontendDomain =
      this.configService.get('app.frontendDomain', { infer: true }) ||
      'http://localhost:3000';
    const verificationLink = `${frontendDomain}/auth/verify-email?email=${encodeURIComponent(result.user.email)}&token=${token}`;

    // Render email using React Email
    const html = await render(
      OtpEmailTemplate({
        firstName: result.user.firstName || 'User',
        verificationLink,
        organizationName: 'Education SAAS',
      }),
    );

    // Send email
    await this.mailService.sendMail({
      to: result.user.email,
      subject: 'Welcome! Please verify your email',
      html,
    });

    return {
      message: 'Registration successful. Please verify your email.',
      email: result.user.email,
    };
  }
}
