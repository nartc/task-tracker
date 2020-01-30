import { AutoMap } from '@nartc/automapper';
import { BaseVm } from '../common/base.model';
import { RoleVm } from '../role/models/vms/role.vm';

export class AuthUser extends BaseVm {
  @AutoMap()
  email: string;
  @AutoMap(() => RoleVm)
  role: RoleVm;
  @AutoMap()
  isSuper: boolean;
}
