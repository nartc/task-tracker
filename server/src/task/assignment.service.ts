import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '../common/base.service';
import { Assignment } from './models/assignment.model';

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    @InjectModel(Assignment.modelName)
    private readonly assignmentModel: ReturnModelType<typeof Assignment>,
  ) {
    super(assignmentModel);
  }
}
