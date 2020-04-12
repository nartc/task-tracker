import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { BaseService } from '../common/base.service';
import { RoleService } from '../role/role.service';
import { User } from './models/user.model';
import { UserInformationVm } from './models/vms/user-information.vm';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName)
    private readonly userModel: ReturnModelType<typeof User>,
    private readonly roleService: RoleService,
    @InjectMapper() private readonly mapper: AutoMapper,
  ) {
    super(userModel);
  }

  findByEmail(email: string): Promise<User> {
    try {
      return this.findOne(true, true).where('email').equals(email).exec();
    } catch (e) {
      UserService.throwMongoError(e);
    }
  }

  async assignRole(roleId: string, userId: string): Promise<UserInformationVm> {
    const role = await this.roleService.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role.id;
    user.updatedAt = new Date();
    const result = await this.update(user, true, true);
    return this.mapper.map(result, UserInformationVm, User);
  }
}
