import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ApiController, ApiOperationId } from '../common/decorators/swagger.decorator';
import { UseAuthGuards } from '../common/decorators/use-auth-guards.decorator';
import { PermissionPrivilege } from '../common/permissions/permission-priviledge.enum';
import { Task } from './models/task.model';
import { CreateTaskParamsVm } from './models/vms/create-task-params.vm';
import { TaskVm } from './models/vms/task.vm';
import { TaskService } from './task.service';

@ApiController('tasks', Task.modelName)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseAuthGuards({ task: PermissionPrivilege.Read })
  @ApiOperationId({summary: 'Use Middleware'})
  async getAll(): Promise<TaskVm[]> {
    return this.taskService.getAll();
  }

  @Get('name')
  @UseAuthGuards({ task: PermissionPrivilege.Read })
  @ApiOperationId()
  async getByName(@Query('name') name: string): Promise<TaskVm> {
    return this.taskService.getByName(name);
  }

  @Get(':id')
  @UseAuthGuards({ task: PermissionPrivilege.Read })
  @ApiOperationId()
  async getById(@Param('id') id: string): Promise<TaskVm> {
    return this.taskService.getById(id);
  }

  @Post()
  @UseAuthGuards({ task: PermissionPrivilege.Create })
  @ApiOperationId()
  async createTask(@Body() params: CreateTaskParamsVm): Promise<TaskVm> {
    return this.taskService.createTask(params);
  }

  @Put()
  @UseAuthGuards({ task: PermissionPrivilege.Update })
  @ApiOperationId()
  async updateTask(@Body() vm: TaskVm): Promise<TaskVm> {
    return this.taskService.updateTask(vm);
  }

  @Delete(':id')
  @UseAuthGuards({ task: PermissionPrivilege.Delete })
  @ApiOperationId()
  async deleteTask(@Param('id') id: string): Promise<TaskVm> {
    return this.taskService.deleteTask(id);
  }
}
