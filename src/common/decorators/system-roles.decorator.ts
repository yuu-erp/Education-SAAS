import { SetMetadata } from '@nestjs/common';
import { DECORATOR } from './decorator.enum';
import { SystemRole } from '@prisma/prisma/enums';

export const SystemRoles = (
  ...roles: SystemRole[]
): ReturnType<typeof SetMetadata> => SetMetadata(DECORATOR.SYSTEM_ROLES, roles);
