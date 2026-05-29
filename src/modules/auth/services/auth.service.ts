/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';
import { AUTH_MESSAGES } from '../constants';
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto';
import { AuthTokens } from '../interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto): Promise<AuthTokens> {
    this.logger.log(`[AUTH] REGISTER attempt: ${registerDto.email}`);

    // Mock response for foundation testing
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    this.logger.log(`[AUTH] LOGIN attempt: ${loginDto.email}`);

    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async logout(): Promise<{ message: string }> {
    this.logger.log(`[AUTH] LOGOUT attempt`);

    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log(
      `[AUTH] FORGOT PASSWORD attempt: ${forgotPasswordDto.email}`,
    );

    return {
      message: 'Password reset link sent to email',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log(
      `[AUTH] RESET PASSWORD attempt with token: ${resetPasswordDto.token}`,
    );

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET,
    };
  }

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
