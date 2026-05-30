import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { MailService } from '@/integrations/mail/core/mail.service';
import { ResetPasswordEmailTemplate } from '@/integrations/mail/templates/auth/reset-password.template';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config';
import { OtpService } from './otp.service';
import { OtpType } from '@prisma/prisma/enums';
import { render } from '@react-email/render';
import * as argon2 from 'argon2';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto';
import { AUTH_MESSAGES } from '../constants';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log(
      `[AUTH] FORGOT PASSWORD attempt: ${forgotPasswordDto.email}`,
    );

    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // Return success to avoid user enumeration vulnerability
      this.logger.warn(
        `[AUTH] Forgot password email ${forgotPasswordDto.email} not found.`,
      );
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    const token = await this.prisma.$transaction(async (tx) => {
      return this.otpService.generateOtp(user.id, OtpType.PASSWORD_RESET, tx);
    });

    const frontendDomain =
      this.configService.get('app.frontendDomain', {
        infer: true,
      }) || 'http://localhost:3000';

    const resetLink = `${frontendDomain}/auth/reset-password?token=${token}`;

    const html = await render(
      ResetPasswordEmailTemplate({
        firstName: user.firstName || 'User',
        resetLink,
        organizationName: 'Education SAAS',
      }),
    );

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html,
    });

    return {
      message: 'Password reset link sent to email',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log(`[AUTH] RESET PASSWORD attempt.`);

    // Fetch all active unexpired password reset tokens
    const activeTokens = await this.prisma.otpToken.findMany({
      where: {
        type: OtpType.PASSWORD_RESET,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    let matchedToken: (typeof activeTokens)[number] | null = null;

    // Verify token against active tokens
    for (const tokenRecord of activeTokens) {
      const isMatch = await argon2.verify(
        tokenRecord.codeHash,
        resetPasswordDto.token,
      );
      if (isMatch) {
        matchedToken = tokenRecord;
        break;
      }
    }

    if (!matchedToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await argon2.hash(resetPasswordDto.password);

    await this.prisma.$transaction(async (tx) => {
      // 1. Update user password
      await tx.user.update({
        where: { id: matchedToken.userId },
        data: { passwordHash: hashedPassword },
      });

      // 2. Mark token as used
      await tx.otpToken.update({
        where: { id: matchedToken.id },
        data: { usedAt: new Date() },
      });
    });

    this.logger.log(
      `[AUTH] Password reset successfully for userId: ${matchedToken.userId}`,
    );

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET,
    };
  }
}
