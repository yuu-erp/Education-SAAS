import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { OtpType } from '@prisma/prisma/enums';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly MAX_ATTEMPTS = 5;
  private readonly OTP_EXPIRY_MINUTES = 15;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a random secure token
   */
  private generateRandomCode(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generates and stores a new OTP for a user
   */
  async generateOtp(userId: string, type: OtpType): Promise<string> {
    const rawCode = this.generateRandomCode();
    const codeHash = await argon2.hash(rawCode);

    // Invalidate old unused OTPs of the same type for this user
    await this.prisma.otpToken.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
      },
      data: {
        // Mark as expired to invalidate
        expiresAt: new Date(),
      },
    });

    // Create new OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    await this.prisma.otpToken.create({
      data: {
        userId,
        type,
        codeHash,
        expiresAt,
      },
    });

    return rawCode;
  }

  /**
   * Verifies an OTP code for a user
   */
  async verifyOtp(
    userId: string,
    type: OtpType,
    code: string,
  ): Promise<boolean> {
    const latestToken = await this.prisma.otpToken.findFirst({
      where: {
        userId,
        type,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestToken) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (latestToken.attempts >= this.MAX_ATTEMPTS) {
      throw new BadRequestException(
        'Too many failed attempts. Please request a new OTP.',
      );
    }

    const isMatch = await argon2.verify(latestToken.codeHash, code);

    if (!isMatch) {
      // Increment attempts
      await this.prisma.otpToken.update({
        where: { id: latestToken.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP');
    }

    // Mark as used
    await this.prisma.otpToken.update({
      where: { id: latestToken.id },
      data: { usedAt: new Date() },
    });

    return true;
  }
}
