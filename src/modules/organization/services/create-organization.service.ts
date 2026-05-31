import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateOrganizationDto } from '../dto';
import {
  Role,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@prisma/prisma/enums';

@Injectable()
export class CreateOrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateOrganizationDto) {
    // Kiểm tra xem slug đã tồn tại chưa
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (existingOrg) {
      throw new ConflictException('Slug đã tồn tại. Vui lòng chọn slug khác.');
    }

    // Thời gian trial mặc định: 30 ngày
    const trialDays = 30;
    const now = new Date();
    const currentPeriodEnd = new Date(
      now.getTime() + trialDays * 24 * 60 * 60 * 1000,
    );

    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo Organization
      const organization = await tx.organization.create({
        data: dto,
      });

      // 2. Cấp Trial Subscription (PRO, 30 days)
      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          plan: SubscriptionPlan.PRO,
          status: SubscriptionStatus.TRIAL,
          currentPeriodStart: now,
          currentPeriodEnd: currentPeriodEnd,
        },
      });

      // 3. Gán quyền OWNER cho người tạo
      await tx.membership.create({
        data: {
          userId,
          organizationId: organization.id,
          role: Role.OWNER,
        },
      });

      return organization;
    });
  }
}
