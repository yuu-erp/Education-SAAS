import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ForbiddenException extends AppException {
  constructor(
    message = 'Forbidden',
    errors: unknown[] = [],
    errorCode?: string,
  ) {
    super(message, HttpStatus.FORBIDDEN, errors, errorCode);
  }
}
