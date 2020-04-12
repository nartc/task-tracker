import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthUser } from '../../security/auth-user';
import { PERMISSIONS_DECORATOR } from '../decorators/permission.decorator';
import { Permission } from '../permissions/permission';
import { PermissionPrivilege } from '../permissions/permission-priviledge.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const routePermissions = this.reflector.get<{ [key in keyof Permission]?: PermissionPrivilege }>(
      PERMISSIONS_DECORATOR,
      context.getHandler(),
    );

    if (!routePermissions || !Object.keys(routePermissions).length) {
      return true;
    }

    const currentUser = context.switchToHttp().getRequest<Request>().user as AuthUser;
    const hasPermission = () =>
      Object.entries(currentUser.role.permissions).every(
        ([key, score]) => !routePermissions[key] || score & routePermissions[key],
      );

    return currentUser && (currentUser.isSuper || hasPermission());
  }
}
