import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly errors: unknown[] = [],
    public readonly errorCode?: string,
  ) {
    super(message, statusCode);
  }
}
