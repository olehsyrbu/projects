import { ROLE_NAMES } from '@/core/definitions';

export const userFixtures = {
  defaultJoeUser() {
    return userFixtures.defaultUser({
      id: 'some-joe-user-id-1',
      firstName: 'Joe',
      lastName: 'Joe',
      email: 'joe@example.com',
      role: ROLE_NAMES.USER,
      loggedInAt: '2021-10-06T11:57:37.686Z',
    });
  },

  defaultUser({ id, firstName, lastName, isAdmin, email }) {
    return {
      id: id || `${Math.random()}`,
      firstName,
      lastName,
      email,
      role: isAdmin ? ROLE_NAMES.REFERRAL_COORDINATOR : ROLE_NAMES.TEAM_MEMBER,
      loggedInAt: '2021-11-05T11:57:37.686Z',
    };
  },

  successResponseOnUserUpdate() {
    return {
      fullName: 'TM1 TM1',
      firstName: 'TM1',
      lastName: 'TM1',
      role: 'TEAM_MEMBER',
    };
  },
};
