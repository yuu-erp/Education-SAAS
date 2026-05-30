import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { TokenService } from './token.service';
import { AuthTokens } from '../interfaces';

export interface GoogleProfile {
  provider: string;
  providerAccountId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async authenticate(
    profile: GoogleProfile,
  ): Promise<{ tokens: AuthTokens; isNew: boolean; user: any }> {
    this.logger.log(
      `[AUTH] Google authentication attempt for email: ${profile.email}`,
    );

    // Step 1: Check if SocialAccount already exists for provider + providerAccountId (Case 3)
    const socialAccount = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'GOOGLE',
          providerAccountId: profile.providerAccountId,
        },
      },
      include: {
        user: {
          include: {
            memberships: true,
          },
        },
      },
    });

    if (socialAccount) {
      this.logger.log(
        `[AUTH] Google Account already linked to user ID: ${socialAccount.userId}`,
      );

      const user = socialAccount.user;
      const membership = user.memberships[0];
      const organizationId = membership?.organizationId;
      const role = membership?.role;

      const tokens = await this.tokenService.generateTokens(
        user.id,
        user.email,
        organizationId,
        role,
      );

      return { tokens, isNew: false, user };
    }

    // Step 2: Check if email already exists in User table (Case 2)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: profile.email },
      include: { memberships: true },
    });

    if (existingUser) {
      this.logger.log(
        `[AUTH] User with email ${profile.email} exists. Linking Google Account.`,
      );

      // Link Google Account to existing User
      await this.prisma.$transaction(async (tx) => {
        // Create SocialAccount link
        await tx.socialAccount.create({
          data: {
            userId: existingUser.id,
            provider: 'GOOGLE',
            providerAccountId: profile.providerAccountId,
          },
        });

        // Auto verify email since Google verified it
        if (!existingUser.emailVerified) {
          await tx.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: true },
          });
          existingUser.emailVerified = true;
        }
      });

      const membership = existingUser.memberships[0];
      const organizationId = membership?.organizationId;
      const role = membership?.role;

      const tokens = await this.tokenService.generateTokens(
        existingUser.id,
        existingUser.email,
        organizationId,
        role,
      );

      return { tokens, isNew: false, user: existingUser };
    }

    // Step 3: Completely new user (Case 1)
    this.logger.log(
      `[AUTH] Creating new user for Google Account: ${profile.email}`,
    );

    const { user } = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.picture,
          emailVerified: true, // Google email is verified
          status: 'ACTIVE',
        },
      });

      await tx.socialAccount.create({
        data: {
          userId: newUser.id,
          provider: 'GOOGLE',
          providerAccountId: profile.providerAccountId,
        },
      });

      return { user: newUser };
    });

    const tokens = await this.tokenService.generateTokens(
      user.id,
      user.email,
      undefined,
      undefined,
    );

    return { tokens, isNew: true, user };
  }
}
