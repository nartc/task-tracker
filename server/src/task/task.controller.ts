import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permission.decorator';
import { ApiErrors, ApiOperationId } from '../common/decorators/swagger.decorator';
import { UseAuthGuards } from '../common/decorators/use-auth-guards.decorator';
import { PermissionPrivilege } from '../common/permissions/permission-priviledge.enum';
import { Task } from './models/task.model';
import { CreateTaskParamsVm } from './models/vms/create-task-params.vm';
import { TaskVm } from './models/vms/task.vm';
import { TaskService } from './task.service';

@Controller('tasks')
@ApiTags(Task.modelName)
@ApiErrors()
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseAuthGuards()
  @Permissions({ task: PermissionPrivilege.Create })
  @ApiOperationId()
  async createTask(@Body() params: CreateTaskParamsVm): Promise<TaskVm> {
    return this.taskService.createTask(params);
  }
}
