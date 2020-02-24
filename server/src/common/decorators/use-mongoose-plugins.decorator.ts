import { plugin } from '@typegoose/typegoose';
import * as autoPopulate from 'mongoose-autopopulate';
import * as leanVirtuals from 'mongoose-lean-virtuals';

export const useMongoosePlugins = (): ClassDecorator => target => {
  plugin(autoPopulate)(target);
  plugin(leanVirtuals)(target);
};
