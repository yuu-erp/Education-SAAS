import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config';
import { RequestUser } from '@/common/types';
import { Role, SystemRole } from '@prisma/prisma/enums';

type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  systemRole: SystemRole;
  organizationId?: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret', {
        infer: true,
      }) as string,
    });
  }

  validate(payload: JwtPayload): RequestUser {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      id: payload.sub,
      email: payload.email,
      systemRole: payload.systemRole,
      organizationId: payload.organizationId,
      role: payload.role,
    };
  }
}
