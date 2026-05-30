import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AllConfigType } from '@/config';

interface GoogleProfile {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super({
      clientID:
        configService.get('auth.googleClientId', { infer: true }) ||
        'placeholder-id',
      clientSecret:
        configService.get('auth.googleClientSecret', { infer: true }) ||
        'placeholder-secret',
      callbackURL: configService.get('auth.googleCallbackUrl', { infer: true }),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): void {
    const googleProfile = profile as GoogleProfile;
    const { name, emails, photos, id } = googleProfile;
    const user = {
      provider: 'GOOGLE',
      providerAccountId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos && photos[0] ? photos[0].value : undefined,
    };
    done(null, user);
  }
}
