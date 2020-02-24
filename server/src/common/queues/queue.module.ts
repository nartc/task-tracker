import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { RoleModule } from '../../role/role.module';
import { UserModule } from '../../user/user.module';
import { IConfiguration } from '../configuration/configuration';
import { CONFIG } from '../configuration/configuration.module';
import { RoleQueueConsumer } from './consumers/role/role.consumer';
import { UserQueueConsumer } from './consumers/user/user.consumer';
import { queues } from './queues';

@Global()
@Module({
  imports: [
    BullModule.registerQueueAsync(
      ...queues.map(queue => ({
        name: queue.name,
        inject: [CONFIG],
        useFactory: (config: IConfiguration) => ({
          name: queue.name,
          redis: {
            host: config.redis.host,
            port: config.redis.port,
          },
          defaultJobOptions: queue.options.defaultJobOptions,
          prefix: queue.options.prefix,
        }),
      })),
    ),
    UserModule,
    RoleModule,
  ],
  providers: [UserQueueConsumer, RoleQueueConsumer],
  exports: [BullModule],
})
export class QueueModule {}
