import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoMapper, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { Role } from '../role/models/role.model';
import { RoleVm } from '../role/models/vms/role.vm';
import { RoleModule } from '../role/role.module';
import { AuthUser } from '../security/auth-user';
import { User } from './models/user.model';
import { UserInformationVm } from './models/vms/user-information.vm';
import { UserVm } from './models/vms/user.vm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Profile()
class UserProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(User, UserVm)
      .forMember(
        d => d.fullName,
        mapFrom(s => s.firstName + ' ' + s.lastName),
      )
      .forMember(
        d => d.roleName,
        mapFrom(s => (s.role as Role).roleName),
      )
      .forMember(
        d => d.roleId,
        mapFrom(s => (s.role as Role).id),
      )
      .reverseMap();

    mapper
      .createMap(User, UserInformationVm)
      .forMember(
        d => d.fullName,
        mapFrom(s => s.firstName + ' ' + s.lastName),
      )
      .reverseMap();

    mapper.createMap(User, AuthUser).forMember(
      d => d.role,
      mapWith(RoleVm, s => s.role),
    );
  }
}

@Module({
  imports: [MongooseModule.forFeature([{ name: User.modelName, schema: User.schema }]), RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
