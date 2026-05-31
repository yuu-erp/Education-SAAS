import { Role } from '@prisma/prisma/enums';

export type RequestUser = {
  id: string | number;
  email: string;
  systemRole: string;

  role?: Role;
  organizationId?: string;
};
