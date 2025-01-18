import { ROLE_NAMES } from '@/core/definitions';

export const teamMemberSpecification = {
  isTeamAdmin(user) {
    return user.role === ROLE_NAMES.REFERRAL_COORDINATOR;
  },

  isTeamMemberOnly(user) {
    return user.role === ROLE_NAMES.TEAM_MEMBER;
  },
};
