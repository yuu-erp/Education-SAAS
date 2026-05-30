import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AllConfigType } from '@/config';
import { AuthTokens } from '../interfaces';
import { Role } from '@prisma/prisma/enums';
import { RefreshTokenDto } from '../dto';
import { PrismaService } from '@/database';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokens(
    userId: string,
    email: string,
    organizationId?: string,
    role?: Role,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email, organizationId, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('auth.refreshSecret', { infer: true }),
        expiresIn: this.configService.get('auth.refreshExpiresIn', {
          infer: true,
        }),
      }),
    ]);

    // TODO:
    // - Store hashed refresh token in DB
    // - Migrate to httpOnly cookies
    // - Implement refresh token rotation

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    this.logger.log(`[AUTH] REFRESH TOKEN attempt`);

    try {
      const refreshSecret =
        (this.configService as ConfigService).get<string>(
          'auth.refreshSecret',
        ) || '';

      const payload: { sub: string } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: refreshSecret,
        },
      );

      const userId = payload.sub;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { memberships: true },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User is inactive or does not exist');
      }

      const primaryMembership = user.memberships[0];

      return this.generateTokens(
        user.id,
        user.email,
        primaryMembership?.organizationId,
        primaryMembership?.role,
      );
    } catch (error) {
      this.logger.error(
        `[AUTH] Refresh token failed: ${(error as Error).message}`,
      );
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
