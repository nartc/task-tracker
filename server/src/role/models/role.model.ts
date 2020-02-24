import { prop } from '@typegoose/typegoose';
import { BaseDocument } from '../../common/base.model';
import { useMongoosePlugins } from '../../common/decorators/use-mongoose-plugins.decorator';
import { Permission } from '../../common/permissions/permission';

@useMongoosePlugins()
export class Role extends BaseDocument {
  @prop({ default: false })
  isGlobal: boolean;
  @prop({ default: '', required: false })
  parentId?: string;
  @prop({
    required: true,
    unique: true,
    index: true,
    text: true,
    maxlength: 255,
    minlength: 6,
  })
  roleName: string;
  @prop({ required: true, maxlength: 255, minlength: 6 })
  note: string;
  @prop({ required: true, default: {} })
  permissions: Permission;
}
