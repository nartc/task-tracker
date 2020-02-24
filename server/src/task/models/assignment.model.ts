import { AutoMap } from '@nartc/automapper';
import { arrayProp, prop, Ref } from '@typegoose/typegoose';
import { BaseDocument } from '../../common/base.model';
import { useMongoosePlugins } from '../../common/decorators/use-mongoose-plugins.decorator';
import { User } from '../../user/models/user.model';
import { TaskStatus } from './task-status.enum';

export class AssignmentNote {
  @prop()
  @AutoMap()
  createdAt: Date;
  @prop()
  @AutoMap()
  updatedAt: Date;
  @prop({ ref: User, autopopulate: true, default: null })
  @AutoMap(() => User)
  addedBy: Ref<User>;
  @prop({ required: true, minlength: 6 })
  content: string;
}

@useMongoosePlugins()
export class Assignment extends BaseDocument {
  @prop({ ref: User, autopopulate: true, default: null })
  @AutoMap(() => User)
  assignedTo: Ref<User>;
  @prop({ required: true, default: TaskStatus.NotStarted })
  @AutoMap()
  status: TaskStatus;
  @arrayProp({
    items: AssignmentNote,
    default: [],
    required: false,
    _id: false,
  })
  notes?: AssignmentNote[];
}
