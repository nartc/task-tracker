import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '../common/base.service';
import { Role } from './models/role.model';
import { CreateRoleParamsVm } from './models/vms/create-role-params.vm';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectModel(Role.modelName)
    private readonly roleModel: ReturnModelType<typeof Role>,
  ) {
    super(roleModel);
  }

  async createRole(params: CreateRoleParamsVm): Promise<void> {
    const newRole = this.createModel(params);
    await this.create(newRole);
  }
}
