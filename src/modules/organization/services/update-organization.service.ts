import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { UpdateOrganizationDto } from '../dto';

@Injectable()
export class UpdateOrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(organizationId: string, dto: UpdateOrganizationDto) {
    const existingOrg = await this.prisma.organization.findUnique({
      where: { id: organizationId, deletedAt: null },
    });

    if (!existingOrg) {
      throw new NotFoundException('Không tìm thấy tổ chức');
    }

    if (dto.slug && dto.slug !== existingOrg.slug) {
      const slugExists = await this.prisma.organization.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException(
          'Slug đã tồn tại. Vui lòng chọn slug khác.',
        );
      }
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: dto,
    });
  }
}
