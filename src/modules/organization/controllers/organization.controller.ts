import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { RequestUser } from '@/common/types';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto';
import {
  CreateOrganizationService,
  GetOrganizationService,
  UpdateOrganizationService,
  DeleteOrganizationService,
} from '../services';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(
    private readonly createOrganizationService: CreateOrganizationService,
    private readonly getOrganizationService: GetOrganizationService,
    private readonly updateOrganizationService: UpdateOrganizationService,
    private readonly deleteOrganizationService: DeleteOrganizationService,
  ) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateOrganizationDto) {
    return this.createOrganizationService.execute(user.id as string, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOrganizationService.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.updateOrganizationService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteOrganizationService.execute(id);
  }
}
