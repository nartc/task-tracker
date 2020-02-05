import { AutoMap } from '@nartc/automapper';
import { prop, Ref } from '@typegoose/typegoose';
import { BaseDocument } from '../../common/base.model';
import { User } from '../../user/models/user.model';

export class Task extends BaseDocument {
  @prop({ required: true, minlength: 6, maxlength: 250, text: true })
  name: string;
  @prop({ required: true, minlength: 6 })
  description: string;
  @prop({ ref: User, autopopulate: true, default: null })
  @AutoMap(() => User)
  createdBy: Ref<User>;
  @prop({ ref: User, autopopulate: true, default: null })
  @AutoMap(() => User)
  updatedBy: Ref<User>;
}
