import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoMapper, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { User } from '../user/models/user.model';
import { UserInformationVm } from '../user/models/vms/user-information.vm';
import { AssignmentService } from './assignment.service';
import { Assignment, AssignmentNote } from './models/assignment.model';
import { Task } from './models/task.model';
import { AssignmentNoteVm, AssignmentVm } from './models/vms/assignment.vm';
import { TaskVm } from './models/vms/task.vm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Profile()
class TaskProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(Task, TaskVm)
      .forMember(
        d => d.createdBy,
        mapWith(UserInformationVm, s => s.createdBy),
      )
      .forMember(
        d => d.updatedBy,
        mapWith(UserInformationVm, s => s.updatedBy),
      )
      .reverseMap()
      .forPath(
        s => s.createdBy,
        mapWith(User, d => d.createdBy),
      )
      .forPath(
        s => s.updatedBy,
        mapWith(User, d => d.updatedBy),
      );
    mapper
      .createMap(Assignment, AssignmentVm)
      .forMember(
        d => d.assignedTo,
        mapWith(UserInformationVm, s => s.assignedTo),
      )
      .forMember(
        d => d.notes,
        mapWith(AssignmentNoteVm, s => s.notes),
      );
    mapper.createMap(AssignmentNote, AssignmentNoteVm).forMember(
      d => d.addedBy,
      mapWith(UserInformationVm, s => s.addedBy),
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
