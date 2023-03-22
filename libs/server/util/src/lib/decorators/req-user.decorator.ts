import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Returns all user data stored in the user object of a Request
 */
export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Logger.debug(JSON.stringify(request.user));
    return request.user;
  }
);

/**
 * Returns the User ID stored in the user object of a Request
 *
 * @example getTodos(@ReqUserId() userId: string) {}
 */
export const ReqUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.userId as string;
  }
);
