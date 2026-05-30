import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AllConfigType } from '@/config';
import { AuthTokens } from '../interfaces';
import { Role } from '@prisma/prisma/enums';
import { RefreshTokenDto } from '../dto';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async generateTokens(
    userId: string,
    email: string,
    organizationId: string,
    role: Role,
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

  /* eslint-disable @typescript-eslint/require-await */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    this.logger.log(
      `[AUTH] REFRESH TOKEN attempt: ${refreshTokenDto.refreshToken}`,
    );

    return {
      accessToken: 'mock-access-token-new',
      refreshToken: 'mock-refresh-token-new',
    };
  }
}
