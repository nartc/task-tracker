import { Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController, ApiOperationId } from '../common/decorators/swagger.decorator';
import { UseAuthGuards } from '../common/decorators/use-auth-guards.decorator';
import { PermissionPrivilege } from '../common/permissions/permission-priviledge.enum';
import { User } from './models/user.model';
import { UserInformationVm } from './models/vms/user-information.vm';
import { UserService } from './user.service';

@ApiController('users', User.modelName)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('role/:userId')
  @ApiOperationId()
  async assignRole(@Query('roleId') roleId: string, @Param('userId') id: string): Promise<UserInformationVm> {
    return this.userService.assignRole(roleId, id);
  }
}
