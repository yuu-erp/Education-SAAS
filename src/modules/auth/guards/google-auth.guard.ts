import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const subdomain = (request.query?.subdomain as string) || '';
    const redirectUri = (request.query?.redirectUri as string) || '';

    // Encapsulate subdomain and redirectUri in state parameter as base64 string
    const stateObj = { subdomain, redirectUri };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    return {
      state,
      prompt: 'select_account',
    };
  }
}
