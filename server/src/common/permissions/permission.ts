import { PermissionScore } from './permission-scrore.enum';

export const domainModels = ['role', 'user', 'task', 'assignment'] as const;
export type DomainModels = typeof domainModels[number];
export type Permission = {
  [key in DomainModels]?: PermissionScore;
};
