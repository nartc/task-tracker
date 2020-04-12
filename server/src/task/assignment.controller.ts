import { Body, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController, ApiOperationId } from '../common/decorators/swagger.decorator';
import { UseAuthGuards } from '../common/decorators/use-auth-guards.decorator';
import { PermissionPrivilege } from '../common/permissions/permission-priviledge.enum';
import { AssignmentService } from './assignment.service';
import { Assignment } from './models/assignment.model';
import { AssignTaskParamsVm } from './models/vms/assign-task-params.vm';
import { AssignmentVm } from './models/vms/assignment.vm';

@ApiController('assignments', Assignment.modelName)
@ApiBearerAuth()
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  @UseAuthGuards({ assignment: PermissionPrivilege.Read })
  @ApiOperationId()
  async getAssignments(): Promise<AssignmentVm[]> {
    return this.assignmentService.getAll();
  }

  @Get(':id')
  @UseAuthGuards({ assignment: PermissionPrivilege.Read })
  @ApiOperationId()
  async getAssignmentById(@Param('id') id: string): Promise<AssignmentVm> {
    return this.assignmentService.getById(id);
  }

  @Post()
  @UseAuthGuards({ assignment: PermissionPrivilege.Create })
  @ApiOperationId()
  async assignTask(@Body() params: AssignTaskParamsVm): Promise<AssignmentVm> {
    return this.assignmentService.assignTask(params);
  }
}
