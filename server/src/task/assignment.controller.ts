import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiErrors, ApiOperationId } from '../common/decorators/swagger.decorator';
import { UseAuthGuards } from '../common/decorators/use-auth-guards.decorator';
import { PermissionPrivilege } from '../common/permissions/permission-priviledge.enum';
import { AssignmentService } from './assignment.service';
import { Assignment } from './models/assignment.model';
import { AssignTaskParamsVm } from './models/vms/assign-task-params.vm';
import { AssignmentVm } from './models/vms/assignment.vm';

@Controller('assignments')
@ApiTags(Assignment.modelName)
@ApiErrors()
@ApiBearerAuth()
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @UseAuthGuards({ assignment: PermissionPrivilege.Create })
  @ApiOperationId()
  async assignTask(@Body() params: AssignTaskParamsVm): Promise<AssignmentVm> {
    return;
  }
}
