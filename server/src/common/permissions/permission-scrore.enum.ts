import { PermissionPrivilege } from './permission-priviledge.enum';

export enum PermissionScore {
  None = 0,
  CanRead = PermissionPrivilege.Read,
  CanCreate = PermissionScore.CanRead + PermissionPrivilege.Create,
  CanUpdate = PermissionScore.CanCreate + PermissionPrivilege.Update,
  CanDelete = PermissionScore.CanUpdate + PermissionPrivilege.Delete,
}
