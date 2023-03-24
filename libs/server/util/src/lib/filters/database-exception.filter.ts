import { IApiErrorResponse } from '@fst/shared/domain';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let error: string = (exception as TypeORMError).message;
    let code: number = (exception as any).code;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database exception occurred';

    this.logger.debug(`DB Exception caught: ${exception.constructor.name}`);
    // this.logger.debug(exception.message);
    switch ((exception as TypeORMError).constructor) {
      case EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        error = (exception as EntityNotFoundError).message;
        code = (exception as any).code;
        message = `Object not found`;
        break;
      case QueryFailedError:
        status = HttpStatus.BAD_REQUEST;
        error = (exception as QueryFailedError).message;
        code = (exception as any).code;
        message = error.toLowerCase().includes('unique')
          ? `Entity is not unique`
          : `Database query failed`;
        break;
    }
    // this.logger.debug(`Exception caught, returning status ${status}`);
    response.status(status).json(generateErrorResponse(error, message));
  }
}

const generateErrorResponse = (
  error: string,
  message: string
): IApiErrorResponse => ({
  message,
  error,
});
