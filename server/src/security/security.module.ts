import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IConfiguration } from '../common/configuration/configuration';
import { CONFIG } from '../common/configuration/configuration.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { JwtStrategyService } from './jwt-strategy.service';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [CONFIG],
      useFactory: (config: IConfiguration) => ({
        secret: config.auth.jwtSecret,
        signOptions: {
          expiresIn: config.auth.jwtExpired,
        },
      }),
    }),
    UserModule,
    RoleModule,
  ],
  controllers: [SecurityController],
  providers: [SecurityService, JwtStrategyService],
})
export class SecurityModule {}
