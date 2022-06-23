import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator<any, any, string>(
  (data, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
