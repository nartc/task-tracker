import { AutoMap } from '@nartc/automapper';
import { arrayProp, prop, Ref } from '@typegoose/typegoose';
import { BaseDocument } from '../../common/base.model';
import { useMongoosePlugins } from '../../common/decorators/use-mongoose-plugins.decorator';
import { User } from '../../user/models/user.model';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.model';

export class AssignmentNote {
  @prop()
  createdAt: Date;
  @prop()
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
  @prop({ ref: Task, autopopulate: true, default: null })
  @AutoMap(() => Task)
  task: Ref<Task>;
}
