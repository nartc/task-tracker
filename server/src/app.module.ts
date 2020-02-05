import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomapperModule } from 'nestjsx-automapper';
import { IConfiguration } from './common/configuration/configuration';
import {
  CONFIG,
  ConfigurationModule,
} from './common/configuration/configuration.module';
import { QueueModule } from './common/queues/queue.module';
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
    AutomapperModule.forRoot(),
    QueueModule,
    RoleModule,
    UserModule,
    SecurityModule,
    TaskModule,
  ],
})
export class AppModule {}
