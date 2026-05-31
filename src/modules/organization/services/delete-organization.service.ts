import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class DeleteOrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(organizationId: string) {
    const existingOrg = await this.prisma.organization.findUnique({
      where: { id: organizationId, deletedAt: null },
    });

    if (!existingOrg) {
      throw new NotFoundException('Không tìm thấy tổ chức');
    }

    // Soft delete: Gắn cờ deletedAt
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: { deletedAt: new Date() },
    });
  }
}
