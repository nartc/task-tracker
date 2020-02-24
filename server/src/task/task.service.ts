import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { BaseService } from '../common/base.service';
import { CurrentUserService } from '../common/current-user/current-user.service';
import { Task } from './models/task.model';
import { CreateTaskParamsVm } from './models/vms/create-task-params.vm';
import { TaskVm } from './models/vms/task.vm';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    private readonly taskModel: ReturnModelType<typeof Task>,
    @InjectMapper() private readonly mapper: AutoMapper,
    private readonly currentUserService: CurrentUserService,
  ) {
    super(taskModel);
  }

  findTaskByName(name: string): Promise<Task> {
    return this.findOne({ name }, true)
      .lean()
      .exec();
  }

  async createTask(params: CreateTaskParamsVm): Promise<TaskVm> {
    const { description, name } = params;
    const task = await this.findTaskByName(name);
    if (task != null) {
      throw new BadRequestException(`Task with ${name} exists`);
    }

    const newTask = this.createModel({ name, description });
    newTask.createdBy = TaskService.toObjectId(this.currentUserService.currentUser.id);
    newTask.updatedBy = TaskService.toObjectId(this.currentUserService.currentUser.id);
    const result = await this.create(newTask);
    return this.mapper.map(result, TaskVm, Task);
  }
}
