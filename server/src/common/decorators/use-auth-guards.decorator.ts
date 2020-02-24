import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../guards/permissions.guard';

export const UseAuthGuards = (withPermission: boolean = true): MethodDecorator => (target, propertyKey, descriptor) => {
  const guards: Parameters<typeof UseGuards> = [AuthGuard()];
  if (withPermission) {
    guards.push(PermissionsGuard);
  }

  UseGuards(...guards)(target, propertyKey as string, descriptor);
};
