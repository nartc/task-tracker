import { UserInformationVm } from '../../user/models/vms/user-information.vm';

export class LoginResultVm {
  token: string;
  user: UserInformationVm;
}
