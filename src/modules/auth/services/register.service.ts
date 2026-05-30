import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { Role } from '@prisma/prisma/enums';
import * as argon2 from 'argon2';
import { RegisterDto } from '../dto';
import { AuthTokens } from '../interfaces';
import { TokenService } from './token.service';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthTokens> {
    this.logger.log(`[AUTH] REGISTER attempt: ${registerDto.email}`);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    // Default organization slug generation
    const slug =
      `${registerDto.firstName}-${registerDto.lastName}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: `${registerDto.firstName}'s Organization`,
          slug,
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          email: registerDto.email,
          passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          // emailVerified is false by default
        },
      });

      // 3. Create Membership (assign OWNER role)
      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: Role.OWNER,
        },
      });

      return { user, organization };
    });

    return this.tokenService.generateTokens(
      result.user.id,
      result.user.email,
      result.organization.id,
      Role.OWNER,
    );
  }
}
