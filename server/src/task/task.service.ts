import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.findOne(true, true).where('name').equals(name).exec();
  }

  async getAll(): Promise<TaskVm[]> {
    const result = await this.findAll(true, true).exec();
    return this.mapper.mapArray(result, TaskVm, Task);
  }

  async getById(id: string): Promise<TaskVm> {
    const result = await this.findById(id, true, true).exec();
    return this.mapper.map(result, TaskVm, Task);
  }

  async getByName(name: string): Promise<TaskVm> {
    const result = await this.findTaskByName(name);
    return this.mapper.map(result, TaskVm, Task);
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

  async updateTask(vm: TaskVm): Promise<TaskVm> {
    const task = await this.findById(vm.id).exec();
    if (task == null) {
      throw new NotFoundException(`There's not task associated with ${vm.id}`);
    }

    const updatedTask = this.mapper.map(vm, Task, TaskVm);
    updatedTask.updatedAt = new Date();
    updatedTask.updatedBy = TaskService.toObjectId(this.currentUserService.currentUser.id);
    const result = await this.update(updatedTask, true, true).exec();
    return this.mapper.map(result, TaskVm, Task);
  }

  async deleteTask(id: string): Promise<TaskVm> {
    const task = await this.findById(id).exec();
    if (task == null) {
      throw new NotFoundException(`There's not task associated with ${id}`);
    }
    const result = await this.deleteById(id, true, true).exec();
    return this.mapper.map(result, TaskVm, Task);
  }
}
