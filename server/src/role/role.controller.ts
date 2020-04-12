import { Body, Get, Post } from '@nestjs/common';
import { ApiController, ApiOperationId } from '../common/decorators/swagger.decorator';
import { Role } from './models/role.model';
import { CreateRoleParamsVm } from './models/vms/create-role-params.vm';
import { RoleVm } from './models/vms/role.vm';
import { RoleService } from './role.service';

@ApiController('roles', Role.modelName)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperationId()
  getAllRoles(): Promise<RoleVm[]> {
    return this.roleService.getAllRoles();
  }

  @Post()
  @ApiOperationId()
  createRole(@Body() params: CreateRoleParamsVm): Promise<void> {
    return this.roleService.createRole(params);
  }
}
