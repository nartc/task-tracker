import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiErrors,
  ApiOperationId,
} from '../common/decorators/swagger.decorator';
import { Role } from './models/role.model';
import { CreateRoleParamsVm } from './models/vms/create-role-params.vm';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags(Role.modelName)
@ApiErrors()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperationId()
  createRole(@Body() params: CreateRoleParamsVm): Promise<void> {
    return this.roleService.createRole(params);
  }
}
