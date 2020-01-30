import {
  DynamicModule,
  Global,
  Inject,
  Module,
  Provider,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { resolve } from 'path';

export const CONFIG = '@@appConfig';
export const InjectConfig = () => Inject(CONFIG);

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  exports: [PassportModule],
})
export class ConfigurationModule {
  static forRoot(
    environment: 'development' | 'production' = 'development',
  ): DynamicModule {
    const providers = this.createProviders(environment);
    return {
      module: ConfigurationModule,
      providers,
      exports: providers,
    };
  }

  private static createProviders(
    environment: 'development' | 'production',
  ): Provider[] {
    const config = require(resolve(__dirname, './', `config.${environment}`));
    return [{ provide: CONFIG, useValue: config.default() }];
  }
}
