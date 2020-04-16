import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { BaseService } from '../common/base.service';
import { Role } from './models/role.model';
import { CreateRoleParamsVm } from './models/vms/create-role-params.vm';
import { RoleVm } from './models/vms/role.vm';
import { superAdminRole } from './role.constant';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectModel(Role.modelName)
    private readonly roleModel: ReturnModelType<typeof Role>,
    @InjectMapper() private readonly mapper: AutoMapper,
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
      throw new BadRequestException();
    }

    const role = this.createModel(superAdminRole);
    await this.create(role);
  }

  async getAllRoles(): Promise<RoleVm[]> {
    const result = await this.findAll(true, true).exec();
    return this.mapper.mapArray(result, RoleVm, Role);
  }

  private async findSystemAdminRole(): Promise<Role> {
    try {
      return this.findOne().where('roleName').equals('Super Admin').exec();
    } catch (e) {
      RoleService.throwMongoError(e);
    }
  }
}
