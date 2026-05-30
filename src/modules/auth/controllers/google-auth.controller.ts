import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import {
  GoogleAuthService,
  GoogleProfile,
} from '../services/google-auth.service';
import { Public } from '@/common/decorators';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Public()
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // GoogleAuthGuard automatically intercepts this and redirects to Google
  }

  @Public()
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: unknown,
    @Res() res: unknown,
  ): Promise<void> {
    const request = req as Request;
    const response = res as Response;
    const googleUser = request.user as GoogleProfile;
    const { tokens, isNew } =
      await this.googleAuthService.authenticate(googleUser);

    // Decode state parameter to handle tenant redirection
    let subdomain = '';
    const stateStr = request.query.state as string;
    if (stateStr) {
      try {
        const decoded = JSON.parse(
          Buffer.from(stateStr, 'base64').toString('utf8'),
        ) as { subdomain?: string };
        subdomain = decoded.subdomain || '';
      } catch {
        // Fallback on parsing error
      }
    }

    const frontendDomain =
      this.configService.get('app.frontendDomain', { infer: true }) ||
      'http://localhost:3000';
    let redirectUrl = frontendDomain;

    if (isNew) {
      // New user goes to onboarding page to set up organization/membership
      redirectUrl = `${frontendDomain}/onboarding?token=${tokens.accessToken}`;
    } else {
      // Existing user redirection
      if (subdomain) {
        // e.g. Redirecting to http://school-a.localhost:3000/auth/callback
        const cleanFrontend = frontendDomain.replace(/^(https?:\/\/)/, '');
        const protocol =
          frontendDomain.match(/^(https?:\/\/)/)?.[0] || 'http://';
        redirectUrl = `${protocol}${subdomain}.${cleanFrontend}/auth/callback?token=${tokens.accessToken}`;
      } else {
        redirectUrl = `${frontendDomain}/auth/callback?token=${tokens.accessToken}`;
      }
    }

    response.redirect(redirectUrl);
  }
}
