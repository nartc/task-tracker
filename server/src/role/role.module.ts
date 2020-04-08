import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoMapper, mapFrom, Profile, ProfileBase } from 'nestjsx-automapper';
import { Role } from './models/role.model';
import { RoleVm } from './models/vms/role.vm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Profile()
class RoleProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(Role, RoleVm)
      .forMember(
        d => d.permissions,
        mapFrom(s => s.permissions),
      )
      .reverseMap()
      .forPath(
        s => s.permissions,
        mapFrom(d => d.permissions),
      );
  }
}

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.modelName, schema: Role.schema }])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
