import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';

@Injectable()
export class LogoutService {
  private readonly logger = new Logger(LogoutService.name);

  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async logout(userId: string): Promise<{ message: string }> {
    this.logger.log(`[AUTH] LOGOUT attempt for user: ${userId}`);
    // TODO:
    // - Invalidate refresh token in DB if stored
    // - Add access token to blacklist/Redis if using stateful JWT
    // - Clear httpOnly cookies if used

    return { message: 'Logged out successfully' };
  }
}
