import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '../common/base.service';
import { Task } from './models/task.model';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    private readonly taskModel: ReturnModelType<typeof Task>,
  ) {
    super(taskModel);
  }
}
