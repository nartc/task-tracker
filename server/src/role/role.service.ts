import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '../common/base.service';
import { Role } from './models/role.model';
import { CreateRoleParamsVm } from './models/vms/create-role-params.vm';
import { superAdminRole } from './role.constant';

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

  async createSystemRoles(): Promise<void> {
    const systemAdminRole = await this.findSystemAdminRole();
    if (systemAdminRole) {
      throw new BadRequestException('System Roles exist');
    }

    const role = this.createModel(superAdminRole);
    await this.create(role);
  }

  private async findSystemAdminRole(): Promise<Role> {
    try {
      return this.findOne().where('roleName').equals('System Admin').exec();
    } catch (e) {
      RoleService.throwMongoError(e);
    }
  }
}
