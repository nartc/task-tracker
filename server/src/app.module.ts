import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomapperModule } from 'nestjsx-automapper';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IConfiguration } from './common/configuration/configuration';
import {
  CONFIG,
  ConfigurationModule,
} from './common/configuration/configuration.module';
import { RoleModule } from './role/role.module';
import { SecurityModule } from './security/security.module';
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
    RoleModule,
    UserModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
