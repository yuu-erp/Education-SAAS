import { SetMetadata } from '@nestjs/common';
import { DECORATOR } from './decorator.enum';

export const Roles = (...roles: string[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(DECORATOR.ROLES, roles);
