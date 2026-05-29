import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(
    message = 'Not Found',
    errors: unknown[] = [],
    errorCode?: string,
  ) {
    super(message, HttpStatus.NOT_FOUND, errors, errorCode);
  }
}
