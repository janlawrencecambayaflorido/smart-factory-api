import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Shape of the user object that JwtStrategy.validate() puts on request.user
export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

// Usage: someMethod(@CurrentUser() user: AuthUser)
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
