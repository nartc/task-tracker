import { PermissionScore } from './permission-scrore.enum';

export const domainModels = ['role', 'user', 'task', 'assignment'] as const;
export type Permission = {
  [key in typeof domainModels[number]]?: PermissionScore;
};
