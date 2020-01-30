import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { IConfiguration } from '../common/configuration/configuration';
import { InjectConfig } from '../common/configuration/configuration.module';
import { JwtPayload } from './jwt-payload';
import { SecurityService } from './security.service';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly securityService: SecurityService,
    @InjectConfig() private readonly config: IConfiguration,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.jwtSecret,
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<void> {
    const user = await this.securityService.validateUser(payload);
    if (!user) {
      return done(
        new UnauthorizedException('Passport error: Unauthorized'),
        null,
      );
    }

    return done(null, user);
  }
}
