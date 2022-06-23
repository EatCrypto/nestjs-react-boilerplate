import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { RolesGuard } from 'src/shared/roles.guard';
import { SerializerInterceptor } from 'src/shared/serializer.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';

export const AuthApi = (dto?: any) => {
  if (dto) {
    return applyDecorators(
      UseGuards(JwtAuthGuard, RolesGuard),
      UseInterceptors(new SerializerInterceptor(dto)),
    );
  }
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard));
};
