import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiErrors, ApiOperationId } from '../common/decorators/swagger.decorator';
import { SecurityService } from './security.service';
import { LoginParamsVm } from './vms/login-params.vm';
import { LoginResultVm } from './vms/login-result.vm';
import { RegisterParamsVm } from './vms/register-params.vm';

@Controller('security')
@ApiTags('Security')
@ApiErrors()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('register')
  @ApiOperationId({ summary: 'Register a new user' })
  register(@Body() params: RegisterParamsVm): Promise<void> {
    return this.securityService.register(params);
  }

  @Post('login')
  @ApiOperationId()
  login(@Body() params: LoginParamsVm): Promise<LoginResultVm> {
    return this.securityService.login(params);
  }
}
