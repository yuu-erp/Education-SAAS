import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown[] = [];
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responsePayload = exception.getResponse();

      if (typeof responsePayload === 'string') {
        message = responsePayload;
      } else if (
        typeof responsePayload === 'object' &&
        responsePayload !== null
      ) {
        const payload = responsePayload as Record<string, unknown>;
        message = (payload.message as string) || exception.message;
        errors = Array.isArray(payload.errors) ? payload.errors : [];
        errorCode = payload.errorCode as string | undefined;
      }
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      (exception as Record<string, unknown>).name ===
        'PrismaClientKnownRequestError'
    ) {
      const prismaError = exception as Record<string, unknown>;
      const code = prismaError.code as string;
      // Prisma error mapping
      if (code === 'P2002') {
        statusCode = HttpStatus.CONFLICT;
        message = 'Unique constraint failed';
        errorCode = 'PRISMA_CONFLICT';
      } else if (code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        errorCode = 'PRISMA_NOT_FOUND';
      } else {
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Database error: ${code}`;
        errorCode = 'PRISMA_ERROR';
      }
    } else if (exception instanceof Error) {
      // Catch other errors (unhandled)
      message = exception.message;
    }

    // Log the error
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception instanceof Error ? exception.stack : String(exception)}`,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${statusCode} - ${message}`,
      );
    }

    // Format consistent response
    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errorCode ? { errorCode } : {}),
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
