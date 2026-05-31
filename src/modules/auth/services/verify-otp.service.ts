import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthTokens } from '../interfaces';

@Injectable()
export class VerifyOtpService {
  private readonly logger = new Logger(VerifyOtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthTokens> {
    this.logger.log(`[AUTH] VERIFY OTP attempt: ${verifyOtpDto.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: verifyOtpDto.email },
      include: {
        memberships: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Verify OTP code using OtpService
    await this.otpService.verifyOtp(
      user.id,
      verifyOtpDto.type,
      verifyOtpDto.otp,
    );

    // If OTP verification was successful, mark email as verified (if not already)
    if (!user.emailVerified) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }

    // For this boilerplate, assuming first membership is primary org
    const primaryMembership = user.memberships[0];

    return this.tokenService.generateTokens(
      user.id,
      user.email,
      user.systemRole,
      primaryMembership?.organizationId || '',
      primaryMembership?.role || 'STUDENT',
    );
  }
}
