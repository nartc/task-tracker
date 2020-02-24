import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoMapper, MappingProfileBase, Profile } from 'nestjsx-automapper';
import { UserInformationVm } from '../user/models/vms/user-information.vm';
import { AssignmentService } from './assignment.service';
import { Assignment, AssignmentNote } from './models/assignment.model';
import { Task } from './models/task.model';
import { AssignmentNoteVm, AssignmentVm } from './models/vms/assignment.vm';
import { TaskVm } from './models/vms/task.vm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Profile()
class TaskProfile extends MappingProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(Task, TaskVm)
      .forMember(
        d => d.createdBy,
        opts => opts.mapWith(UserInformationVm, s => s.createdBy),
      )
      .forMember(
        d => d.updatedBy,
        opts => opts.mapWith(UserInformationVm, s => s.updatedBy),
      );
    mapper.createMap(Assignment, AssignmentVm).forMember(
      d => d.assignedTo,
      opts => opts.mapWith(UserInformationVm, s => s.assignedTo),
    );
    mapper.createMap(AssignmentNote, AssignmentNoteVm).forMember(
      d => d.addedBy,
      opts => opts.mapWith(UserInformationVm, s => s.addedBy),
    );
  }
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.modelName, schema: Task.schema },
      { name: Assignment.modelName, schema: Assignment.schema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, AssignmentService],
})
export class TaskModule {}
