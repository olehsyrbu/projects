import { ROLE_NAMES } from '@/core/definitions';

export function getIsRoleGPA(role) {
  return role === ROLE_NAMES.GPA;
}

export function getIsRoleProvider(role) {
  return role === ROLE_NAMES.PROVIDER;
}
