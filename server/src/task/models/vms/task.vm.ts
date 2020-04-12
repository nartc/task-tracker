import { BaseVm } from '../../../common/base.model';
import { UserInformationVm } from '../../../user/models/vms/user-information.vm';

export class TaskVm extends BaseVm {
  name: string;
  description: string;
  createdBy: UserInformationVm;
  updatedBy: UserInformationVm;
  assignCount: number;
}
