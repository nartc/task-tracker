import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { User } from '../../../../user/models/user.model';
import { UserService } from '../../../../user/user.service';
import { userQueue } from '../../queues';
import { UserJob } from './user.jobs';

@Processor(userQueue.name)
export class UserQueueConsumer {
  constructor(private readonly userService: UserService) {}

  @Process(UserJob.AddUserQueue)
  async addUser(job: Job<User>) {
    const { data } = job;
    return await this.userService.create(data);
  }
}
