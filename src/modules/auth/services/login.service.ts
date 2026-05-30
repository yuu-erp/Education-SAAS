/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from '../dto';
import { AuthTokens } from '../interfaces';
import { AUTH_MESSAGES } from '../constants';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

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
}
