import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { Queue } from 'bull';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { IConfiguration } from '../common/configuration/configuration';
import { InjectConfig } from '../common/configuration/configuration.module';
import { CurrentUserService } from '../common/current-user/current-user.service';
import { UserJob } from '../common/queues/consumers/user/user.jobs';
import { userQueue } from '../common/queues/queues';
import { Role } from '../role/models/role.model';
import { RoleService } from '../role/role.service';
import { User } from '../user/models/user.model';
import { UserInformationVm } from '../user/models/vms/user-information.vm';
import { UserService } from '../user/user.service';
import { AuthUser } from './auth-user';
import { JwtPayload } from './jwt-payload';
import { LoginParamsVm } from './vms/login-params.vm';
import { LoginResultVm } from './vms/login-result.vm';
import { RegisterParamsVm } from './vms/register-params.vm';

@Injectable()
export class SecurityService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly currentUserService: CurrentUserService,
    @InjectMapper() private readonly mapper: AutoMapper,
    @InjectConfig() private readonly config: IConfiguration,
    @InjectQueue(userQueue.name) private readonly userQueue: Queue,
  ) {}

  private static async comparePassword(password: string, encrypt: string): Promise<boolean> {
    try {
      return await compare(password, encrypt);
    } catch (e) {
      throw new InternalServerErrorException(`Error: ${e}`);
    }
  }

  private async hashPassword(data: string): Promise<string> {
    try {
      const salt = await genSalt(this.config.auth.salt);
      return await hash(data, salt);
    } catch (e) {
      throw new InternalServerErrorException(`Error: ${e}`);
    }
  }

  private authenticate(email: string, roleId: string): Promise<string> {
    return this.jwtService.signAsync({ email, roleId });
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.userService.findByEmail(payload.email);
    const authUser = await this.mapper.mapAsync(user, AuthUser, User);
    this.currentUserService.setCurrentUser(authUser);
    return authUser;
  }

  async register(params: RegisterParamsVm): Promise<void> {
    const { email, password, roleId } = params;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException(null, 'Email already exists');
    }

    const newUser = this.userService.createModel(params);
    newUser.password = await this.hashPassword(password);
    newUser.role = await this.roleService.findById(roleId);
    await this.userQueue.add(UserJob.AddUserQueue, newUser);
  }

  async login(params: LoginParamsVm): Promise<LoginResultVm> {
    const { password, email } = params;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(email, 'Wrong credentials');
    }

    const isMatched = await SecurityService.comparePassword(password, user.password);
    if (!isMatched) {
      throw new BadRequestException(password, 'Wrong credentials');
    }

    const token = await this.authenticate(email, (user.role as Role).id);

    const result = new LoginResultVm();
    result.token = token;
    result.user = this.mapper.map(user, UserInformationVm, User);
    return result;
  }
}
