import { Module } from '@nestjs/common';
import { OrganizationController } from './controllers/organization.controller';
import {
  CreateOrganizationService,
  GetOrganizationService,
  UpdateOrganizationService,
  DeleteOrganizationService,
} from './services';

@Module({
  controllers: [OrganizationController],
  providers: [
    CreateOrganizationService,
    GetOrganizationService,
    UpdateOrganizationService,
    DeleteOrganizationService,
  ],
  exports: [
    CreateOrganizationService,
    GetOrganizationService,
    UpdateOrganizationService,
    DeleteOrganizationService,
  ],
})
export class OrganizationModule {}
