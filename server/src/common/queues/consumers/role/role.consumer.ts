import { Process, Processor } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bull';
import { RoleService } from '../../../../role/role.service';
import { roleQueue } from '../../queues';
import { RoleJob } from './role.jobs';

@Processor(roleQueue.name)
export class RoleQueueConsumer {
  constructor(private readonly roleService: RoleService) {}

  @Process(RoleJob.PopulateSystemRolesQueue)
  async populateSystemRoles(job: Job) {
    try {
      return await this.roleService.createSystemRoles();
    } catch (e) {
      if (e instanceof BadRequestException) {
        return job.moveToCompleted('System Roles have already been added');
      }

      throw new Error(typeof e.message === 'object' ? `${e.message.error}: ${e.message.message}` : e.message);
    }
  }
}
