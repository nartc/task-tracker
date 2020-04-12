import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permission } from '../permissions/permission';
import { PermissionPrivilege } from '../permissions/permission-priviledge.enum';
import { Permissions } from './permission.decorator';

export const UseAuthGuards = (permissions?: { [key in keyof Permission]?: PermissionPrivilege }): MethodDecorator => (
  target,
  propertyKey,
  descriptor,
) => {
  const guards: Parameters<typeof UseGuards> = [AuthGuard()];
  if (permissions) {
    guards.push(PermissionsGuard);
    Permissions(permissions)(target, propertyKey as string, descriptor);
  }

  UseGuards(...guards)(target, propertyKey, descriptor);
};
