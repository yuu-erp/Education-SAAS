import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SystemRole } from '@prisma/prisma/enums';
import { DECORATOR } from '../decorators/decorator.enum';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { RequestUser } from '../types/request-user.type';

@Injectable()
export class SystemRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredSystemRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      DECORATOR.SYSTEM_ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredSystemRoles || requiredSystemRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: RequestUser }>();
    const user = request.user;

    if (!user || !user.systemRole) {
      throw new ForbiddenException('Access denied: No system role assigned');
    }

    const hasRole = requiredSystemRoles.includes(user.systemRole as SystemRole);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient system permissions');
    }

    return true;
  }
}
