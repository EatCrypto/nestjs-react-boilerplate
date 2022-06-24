import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const AuthUser = createParamDecorator<User, any, string>(
  (data, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
