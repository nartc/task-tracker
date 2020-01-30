import { BaseVm } from '../../../common/base.model';

export class UserVm extends BaseVm {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleName: string;
  roleId: string;
}
