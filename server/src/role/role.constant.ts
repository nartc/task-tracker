import { domainModels } from '../common/permissions/permission';
import { PermissionScore } from '../common/permissions/permission-scrore.enum';
import { Role } from './models/role.model';

const superAdminRole = new Role();
superAdminRole.roleName = 'Super Admin';
superAdminRole.permissions = domainModels.reduce((permissions, model) => {
  permissions[model] = PermissionScore.CanDelete;
  return permissions;
}, {});
superAdminRole.isGlobal = true;
superAdminRole.note = 'This is pre-built Super Admin role';
superAdminRole.isActive = true;

export { superAdminRole };
