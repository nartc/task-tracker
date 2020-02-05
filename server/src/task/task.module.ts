import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentService } from './assignment.service';
import { Assignment } from './models/assignment.model';
import { Task } from './models/task.model';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.modelName, schema: Task.schema },
      { name: Assignment.modelName, schema: Assignment.schema },
    ]),
  ],
  providers: [TaskService, AssignmentService],
})
export class TaskModule {}
