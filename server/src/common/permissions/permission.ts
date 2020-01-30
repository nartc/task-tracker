import { PermissionScore } from './permission-scrore.enum';

export type DomainModels = 'role' | 'user';
export type Permission = {
  [key in DomainModels]?: PermissionScore;
};
