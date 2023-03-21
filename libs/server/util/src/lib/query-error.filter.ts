import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

export function isQueryFailedError(
  thrownValue: unknown
): thrownValue is QueryFailedError {
  return thrownValue instanceof QueryFailedError;
}

/**
 *
 * @see https://stackoverflow.com/a/66519642
 */
@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter {
  public override catch(exception: QueryFailedError, host: ArgumentsHost): any {
    Logger.debug(JSON.stringify(exception, null, 2));
    Logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.message.includes('UNIQUE')) {
      const invalidKey = exception.message.split(':').pop()?.trim();
      response.status(401).json({
        error: `Unique constraint failed`,
        message: `Value for '${invalidKey}' already exists, try again`,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        path: request.url,
      });
    }
  }
}
