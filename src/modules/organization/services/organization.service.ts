import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    this.logger.log(
      `[ORGANIZATION] Creating organization: ${createOrganizationDto.slug}`,
    );
    return {
      message: 'Create organization endpoint setup successful (Mock)',
      data: createOrganizationDto,
    };
  }

  findOne(id: string) {
    this.logger.log(`[ORGANIZATION] Fetching organization details: ${id}`);
    return {
      message: 'Get organization endpoint setup successful (Mock)',
      id,
    };
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    this.logger.log(`[ORGANIZATION] Updating organization: ${id}`);
    return {
      message: 'Update organization endpoint setup successful (Mock)',
      id,
      data: updateOrganizationDto,
    };
  }

  remove(id: string) {
    this.logger.log(`[ORGANIZATION] Removing organization: ${id}`);
    return {
      message: 'Delete organization endpoint setup successful (Mock)',
      id,
    };
  }
}
