import { plugin, prop } from '@typegoose/typegoose';
import * as leanVirtuals from 'mongoose-lean-virtuals';
import { BaseDocument } from '../../common/base.model';
import { Permission } from '../../common/permissions/permission';

@plugin(leanVirtuals)
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
