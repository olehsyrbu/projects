import { abilitiesFixture } from '@/tools/test-fixtures/abilitiesFixture';
import { ROLE_NAMES } from '@/core/definitions';
import { organizationFixtures } from '@/tools/test-fixtures/organizationFixtures';

function demoOrganization() {
  let demoOrganization = organizationFixtures.demoOrganization();
  return {
    id: demoOrganization.id,
    name: demoOrganization.name,
    subdomain: demoOrganization.subdomain,
  };
}

export const userProfileFixtures = {
  defaultReferralCoordinatorProfile() {
    return {
      id: 'dd4af615-4036-4dd2-9c2b-da8400981af6',
      fullName: 'Referal Coordinatorovhich',
      firstName: 'Referal',
      lastName: 'Coordinatorovhich',
      email: 'rc@example.com',
      createdAt: '2021-08-12T14:41:02.931Z',
      organization: {
        ...demoOrganization(),
      },
      organizations: [
        {
          ...demoOrganization(),
        },
      ],
      ownership: [],
      role: ROLE_NAMES.REFERRAL_COORDINATOR,
      abilities: abilitiesFixture.defaultReferralCoordinator(),
      loggedInAt: '2021-11-05T11:57:37.686Z',
    };
  },

  defaultReferralCoordinatorProfileWithRawConditions() {
    return {
      id: 'dd4af615-4036-4dd2-9c2b-da8400981af6',
      fullName: 'Referal Coordinatorovhich',
      firstName: 'Referal',
      lastName: 'Coordinatorovhich',
      email: 'rc@example.com',
      createdAt: '2021-08-12T14:41:02.931Z',
      organization: {
        ...demoOrganization(),
      },
      organizations: [
        {
          ...demoOrganization(),
        },
      ],
      ownership: [],
      role: ROLE_NAMES.REFERRAL_COORDINATOR,
      abilities: abilitiesFixture.rawReferralCoordinatorConditions(),
      loggedInAt: '2021-11-05T11:57:37.686Z',
    };
  },

  defaultTeamMemberProfile() {
    return {
      id: 'some-default-team-member-id-1',
      fullName: 'Tema Teamovish',
      firstName: 'Team',
      lastName: 'Teamovich',
      email: 'tm@example.com',
      createdAt: '2020-08-12T14:41:02.931Z',
      organization: {
        ...demoOrganization(),
      },
      organizations: [
        {
          ...demoOrganization(),
        },
      ],
      ownership: [],
      role: ROLE_NAMES.TEAM_MEMBER,
      abilities: abilitiesFixture.defaultTeamMember(),
      loggedInAt: '2021-11-05T11:57:37.686Z',
    };
  },

  defaultGPA() {
    return {
      id: '77777777',
      fullName: 'User Userovich',
      firstName: 'User',
      lastName: 'Userovich',
      email: 'user@email.com',
      createdAt: '2020-08-12T14:41:02.931Z',
      organization: {
        ...demoOrganization(),
      },
      organizations: [
        {
          ...demoOrganization(),
        },
      ],
      ownership: [],
      role: ROLE_NAMES.GPA,
      abilities: [],
      loggedInAt: '2020-11-05T11:57:37.686Z',
    };
  },

  defaultUser() {
    return {
      id: '88888888',
      fullName: 'User Userovich',
      firstName: 'User',
      lastName: 'Userovich',
      email: 'user@email.com',
      createdAt: '2020-08-12T14:41:02.931Z',
      organization: {
        ...demoOrganization(),
      },
      organizations: [
        {
          ...demoOrganization(),
        },
      ],
      ownership: [],
      role: ROLE_NAMES.USER,
      abilities: [],
      loggedInAt: '2020-11-05T11:57:37.686Z',
    };
  },
};
