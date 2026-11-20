import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

// Makes every error look like the Lab 05 error format:
// { success, statusCode, message, errors, timestamp }
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error.';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse() as any;
      if (typeof body === 'string') {
        message = body;
      } else if (Array.isArray(body.message)) {
        // class-validator errors come as an array
        message = 'Validation failed.';
        errors = body.message;
      } else {
        message = body.message ?? message;
      }
    } else if (exception instanceof QueryFailedError) {
      const code = (exception as any).code;
      if (code === 'ER_DUP_ENTRY') {
        statusCode = HttpStatus.CONFLICT;
        message = 'A record with the same unique value already exists.';
      } else if (code === 'ER_ROW_IS_REFERENCED_2' || code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = HttpStatus.CONFLICT;
        message = 'This action breaks a relationship with another record.';
      } else {
        console.error(exception);
      }
    } else {
      console.error(exception);
    }

    if (errors.length === 0) errors = [message];

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}