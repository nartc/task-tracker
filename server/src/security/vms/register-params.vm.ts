import { LoginParamsVm } from './login-params.vm';

export class RegisterParamsVm extends LoginParamsVm {
  firstName: string;
  lastName: string;
  roleId: string;
}
