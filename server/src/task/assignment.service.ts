import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { BaseService } from '../common/base.service';
import { CurrentUserService } from '../common/current-user/current-user.service';
import { UserService } from '../user/user.service';
import { Assignment, AssignmentNote } from './models/assignment.model';
import { TaskStatus } from './models/task-status.enum';
import { AssignTaskParamsVm } from './models/vms/assign-task-params.vm';
import { AssignmentVm } from './models/vms/assignment.vm';
import { TaskService } from './task.service';

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    @InjectModel(Assignment.modelName)
    private readonly assignmentModel: ReturnModelType<typeof Assignment>,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly currentUserService: CurrentUserService,
    @InjectMapper() private readonly mapper: AutoMapper,
  ) {
    super(assignmentModel);
  }

  async getAll(): Promise<AssignmentVm[]> {
    const result = await this.findAll(true, true).exec();
    return this.mapper.mapArray(result, AssignmentVm, Assignment);
  }

  async getById(id: string): Promise<AssignmentVm> {
    const result = await this.findById(id, true, true).exec();
    if (!result) {
      throw new NotFoundException('Assignment not found');
    }

    return this.mapper.map(result, AssignmentVm, Assignment);
  }

  async assignTask(params: AssignTaskParamsVm): Promise<AssignmentVm> {
    const { taskId, userId } = params;
    const user = await this.userService.findById(userId, true).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = await this.taskService.findById(taskId, true).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const assignment = this.createModel();
    assignment.task = task.id;
    assignment.assignedTo = user.id;
    assignment.status = TaskStatus.NotStarted;
    const assignmentNote = new AssignmentNote();
    assignmentNote.content = `Assignment created for ${user.firstName} ${user.lastName}`;
    assignmentNote.createdAt = new Date();
    assignmentNote.updatedAt = new Date();
    assignmentNote.addedBy = AssignmentService.toObjectId(this.currentUserService.currentUser.id);
    assignment.notes = [assignmentNote];
    const result = await this.create(assignment);
    return this.mapper.map(result, AssignmentVm, Assignment);
  }
}
