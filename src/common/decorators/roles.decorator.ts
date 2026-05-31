import { SetMetadata } from '@nestjs/common';
import { DECORATOR } from './decorator.enum';
import { Role } from '@prisma/prisma/enums';

export const Roles = (...roles: Role[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(DECORATOR.ROLES, roles);
