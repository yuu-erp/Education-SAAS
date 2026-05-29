import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class UnauthorizedException extends AppException {
  constructor(
    message = 'Unauthorized',
    errors: unknown[] = [],
    errorCode?: string,
  ) {
    super(message, HttpStatus.UNAUTHORIZED, errors, errorCode);
  }
}
