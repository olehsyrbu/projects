import { ROLE_NAMES } from '@/core/definitions';

export function getRedirectUrlByAccount(account) {
  switch (account?.role) {
    case ROLE_NAMES.PROGRAM: {
      return '/program/resources';
    }
    case ROLE_NAMES.GPA: {
      return '/group-practice/resources';
    }

    case ROLE_NAMES.REFERRAL_COORDINATOR: {
      return '/referral-coordinator/resources';
    }

    case ROLE_NAMES.TEAM_MEMBER: {
      return '/referral-coordinator/resources';
    }
    case ROLE_NAMES.NETWORK_MANAGER: {
      return '/resources/';
    }

    default: {
      return '/provider/dashboard';
    }
  }
}
