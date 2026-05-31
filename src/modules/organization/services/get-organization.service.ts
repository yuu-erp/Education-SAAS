import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class GetOrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId, deletedAt: null },
      include: {
        subscription: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Không tìm thấy tổ chức');
    }

    return organization;
  }
}
