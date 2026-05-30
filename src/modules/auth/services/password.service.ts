/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto';
import { AUTH_MESSAGES } from '../constants';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

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
}
