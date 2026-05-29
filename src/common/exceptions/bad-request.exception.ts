import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class BadRequestException extends AppException {
  constructor(
    message = 'Bad Request',
    errors: unknown[] = [],
    errorCode?: string,
  ) {
    super(message, HttpStatus.BAD_REQUEST, errors, errorCode);
  }
}
