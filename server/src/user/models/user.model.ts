import { AutoMap } from '@nartc/automapper';
import { plugin, prop, Ref } from '@typegoose/typegoose';
import * as autoPopulate from 'mongoose-autopopulate';
import * as leanVirtuals from 'mongoose-lean-virtuals';
import { BaseDocument } from '../../common/base.model';
import { Role } from '../../role/models/role.model';

@plugin(autoPopulate)
@plugin(leanVirtuals)
export class User extends BaseDocument {
  @prop({ default: false })
  isSuper: boolean;
  @prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 8,
    maxlength: 100,
    text: true,
  })
  email: string;
  @prop({ required: true, minlength: 1, maxlength: 100, index: true })
  firstName: string;
  @prop({ required: true, minlength: 1, maxlength: 100, index: true })
  lastName: string;
  @prop({ required: true, minlength: 6 })
  password: string;
  @prop({ ref: Role, autopopulate: true, default: null })
  @AutoMap(() => Role)
  role: Ref<Role>;
}
