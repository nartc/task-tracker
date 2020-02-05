import { AutoMap } from '@nartc/automapper';
import { BaseVm } from '../../../common/base.model';
import { UserInformationVm } from '../../../user/models/vms/user-information.vm';
import { TaskStatus } from '../task-status.enum';

export class AssignmentNoteVm {
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  updatedAt: Date;
  addedBy: UserInformationVm;
  content: string;
}

export class AssignmentVm extends BaseVm {
  assignedTo: UserInformationVm;
  @AutoMap()
  status: TaskStatus;
  notes?: AssignmentNoteVm[];
}
