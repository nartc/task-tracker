import { SetMetadata } from '@nestjs/common';
import { Permission } from '../permissions/permission';
import { PermissionPrivilege } from '../permissions/permission-priviledge.enum';

export const PERMISSIONS_DECORATOR = 'allowed:permissions';
export const Permissions = (
  permissions: { [key in keyof Permission]?: PermissionPrivilege },
) => SetMetadata(PERMISSIONS_DECORATOR, permissions);
