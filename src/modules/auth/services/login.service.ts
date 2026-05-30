import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { TokenService } from './token.service';
import * as argon2 from 'argon2';
import { LoginDto } from '../dto';
import { AuthTokens } from '../interfaces';
import { AUTH_MESSAGES } from '../constants';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    this.logger.log(`[AUTH] LOGIN attempt: ${loginDto.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: { memberships: true },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.LOGIN_FAILED);
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(AUTH_MESSAGES.LOGIN_FAILED);
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.LOGIN_FAILED);
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email address before logging in.',
      );
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Your account is not active. Please contact support.',
      );
    }

    // Default to the first membership if available
    const membership = user.memberships[0];
    const organizationId = membership?.organizationId;
    const role = membership?.role;

    return this.tokenService.generateTokens(
      user.id,
      user.email,
      organizationId,
      role,
    );
  }
}
