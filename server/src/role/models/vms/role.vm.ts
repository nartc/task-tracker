import { ApiProperty } from '@nestjs/swagger';
import { BaseVm } from '../../../common/base.model';
import { Permission } from '../../../common/permissions/permission';

export class RoleVm extends BaseVm {
  isGlobal: boolean;
  parentId?: string;
  roleName: string;
  note: string;
  @ApiProperty({ default: {} })
  permissions: Permission;
}
