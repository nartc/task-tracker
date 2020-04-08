import { AutoMap } from '@nartc/automapper';
import { BaseVm } from '../../../common/base.model';
import { UserInformationVm } from '../../../user/models/vms/user-information.vm';
import { TaskStatus } from '../task-status.enum';

export class AssignmentNoteVm {
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  updatedAt: Date;
  @AutoMap(() => UserInformationVm)
  addedBy: UserInformationVm;
  @AutoMap()
  content: string;
}

export class AssignmentVm extends BaseVm {
  @AutoMap(() => UserInformationVm)
  assignedTo: UserInformationVm;
  @AutoMap()
  status: TaskStatus;
  @AutoMap(() => AssignmentNoteVm)
  notes?: AssignmentNoteVm[];
}
