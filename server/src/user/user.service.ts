import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '../common/base.service';
import { User } from './models/user.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {
    super(userModel);
  }

  findByEmail(email: string): Promise<User> {
    return this.findOneAsync({ email });
  }
}
