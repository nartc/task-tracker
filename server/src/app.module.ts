import { InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { AutomapperModule } from 'nestjsx-automapper';
import { IConfiguration } from './common/configuration/configuration';
import { CONFIG, ConfigurationModule } from './common/configuration/configuration.module';
import { CurrentUserModule } from './common/current-user/current-user.module';
import { RoleJob } from './common/queues/consumers/role/role.jobs';
import { QueueModule } from './common/queues/queue.module';
import { roleQueue } from './common/queues/queues';
import { RoleModule } from './role/role.module';
import { SecurityModule } from './security/security.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [CONFIG],
      useFactory: (config: IConfiguration) => ({
        uri: config.mongo.uri,
        retryAttempts: 5,
        retryDelay: 1000,
        useFindAndModify: false,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }),
    }),
    ConfigurationModule.forRoot(),
    AutomapperModule.withMapper(),
    QueueModule,
    CurrentUserModule,
    RoleModule,
    UserModule,
    SecurityModule,
    TaskModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectQueue(roleQueue.name) private readonly roleQueue: Queue) {}

  async onModuleInit() {
    await this.roleQueue.add(RoleJob.PopulateSystemRolesQueue);
  }
}
