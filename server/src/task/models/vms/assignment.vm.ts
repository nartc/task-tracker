import { AutoMap } from '@nartc/automapper';
import { ApiProperty } from '@nestjs/swagger';
import { BaseVm } from '../../../common/base.model';
import { UserInformationVm } from '../../../user/models/vms/user-information.vm';
import { TaskStatus } from '../task-status.enum';
import { TaskVm } from './task.vm';

export class AssignmentNoteVm {
  createdAt: Date;
  updatedAt: Date;
  addedBy: UserInformationVm;
  content: string;
}

export class AssignmentVm extends BaseVm {
  assignedTo: UserInformationVm;
  @AutoMap()
  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus;
  notes?: AssignmentNoteVm[];
  task: TaskVm;
}
