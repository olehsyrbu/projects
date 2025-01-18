import { InvitationTypes, InvitationStatus } from '@/core/definitions';
import { userFixtures } from '@/tools/test-fixtures/userFixtures';

export const invitationFixture = {
  teamMember({ id, email, firstName, lastName, isAdmin, status, type, sentAt }) {
    return {
      id: id || `${Math.random()}`,
      email,
      recipientName: `${firstName} ${lastName}`,
      invitationCode: id && 'code-' + id,
      type: type || InvitationTypes.OrganizationMember,
      status: status || InvitationStatus.Open,
      messageType: 'EMAIL',
      sentAt: sentAt,
      user: userFixtures.defaultUser({
        id: id && 'user-' + id,
        firstName,
        lastName,
        isAdmin,
        email,
      }),
    };
  },

  invitationWithoutUser({ email, firstName, lastName, status, type, sentAt }) {
    return {
      id: `${Math.random()}`,
      email,
      recipientName: `${firstName} ${lastName}`,
      invitationCode: `${Math.random()}`,
      type: type || InvitationTypes.OrganizationMember,
      status: status || InvitationStatus.Open,
      messageType: 'EMAIL',
      sentAt: sentAt || '2021-11-22T07:10:19.697Z',
      user: null,
    };
  },

  emptyList() {
    return {
      items: [],
      pageInfo: {
        perPage: 0,
        totalPages: 0,
        hasPrevPage: false,
        hasNextPage: false,
        totalItems: 0,
      },
    };
  },

  defaultTeamMembersList() {
    return {
      items: [
        {
          id: '95d1cf1c-b01b-4b2f-aab8-ef3cf0b2b4ae',
          email: 'newRc@email.com',
          recipientName: 'New RC 1',
          invitationCode: 'n2xbVo',
          type: 'REFERRAL_COORDINATOR',
          status: 'ACCEPTED',
          messageType: 'EMAIL',
          sentAt: null,
          user: null,
        },
        {
          id: 'd214d62c-5240-4007-9289-386b0df01b41',
          email: 'newRc2@email.com',
          recipientName: 'New RC 2',
          invitationCode: 'cXp6TF9Sn6NXx6WRgbaVjuXLjaioP',
          type: 'REFERRAL_COORDINATOR',
          status: 'ACCEPTED',
          messageType: 'EMAIL',
          sentAt: null,
          user: null,
        },
        {
          id: '282ce8b9-786a-42d4-ad9c-d5ce2d1eecb1',
          email: 'demo@email.com',
          recipientName: 'Demo Demo1',
          invitationCode: 'P7CddGeBnF',
          type: 'REFERRAL_COORDINATOR',
          status: 'ACCEPTED',
          messageType: 'EMAIL',
          sentAt: null,
          user: {
            id: '19d9c339-c31d-4887-82b3-89f837be5fc0',
            firstName: 'RC4',
            lastName: 'RC4',
            email: 'rc4+igornester@gmail.com',
            role: 'REFERRAL_COORDINATOR',
            loggedInAt: '2021-11-05T11:57:37.686Z',
          },
        },
        {
          id: '2d5b8a26-2b4c-428c-8e52-b0d14ea5a4ad',
          email: 'joook123@wiik.com',
          recipientName: 'JooonWWWWIIKK',
          invitationCode: 'e9DwJXqyxdeBXRmjGZFB8VWpcDR1hEo',
          type: 'ORGANIZATION_MEMBER',
          status: 'ACCEPTED',
          messageType: 'EMAIL',
          sentAt: null,
          user: {
            id: 'a1dbaebc-6b86-4561-ae16-850c1eed3476',
            firstName: 'TM1',
            lastName: 'TM1',
            email: 'tm1+igornester@gmail.com',
            role: 'TEAM_MEMBER',
            loggedInAt: '2021-11-05T11:57:37.686Z',
          },
        },
        {
          id: '7cb29cd0-ecce-42e8-8e61-0945c7bd71ab',
          email: 'tm3@provider.com',
          recipientName: 'JooonWWWWIIKK',
          invitationCode: 'HFDa5VttB',
          type: 'ORGANIZATION_MEMBER',
          status: 'ACCEPTED',
          messageType: 'EMAIL',
          sentAt: null,
          user: {
            id: '4b0be487-e574-45c8-9304-0c64c7629ed0',
            firstName: 'tm2',
            lastName: 'tm2',
            email: 'tm2+igornester@gmail.com',
            role: 'TEAM_MEMBER',
            loggedInAt: '2021-11-05T11:57:37.686Z',
          },
        },
        {
          id: 'd43cd7df-d356-441e-bb3f-b049f1c469c7',
          email: 'tm5@provider.com',
          recipientName: 'TM5',
          invitationCode: 'KQF7T',
          type: 'ORGANIZATION_MEMBER',
          status: 'OPEN',
          messageType: 'EMAIL',
          sentAt: null,
          user: null,
        },
      ],
      pageInfo: {
        perPage: 100,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
        totalItems: 6,
      },
    };
  },

  batchCreateOnlySuccess() {
    return {
      failed: [],
      success: [
        {
          id: '6dda1543-fbfb-4fff-9774-2b404baa9f21',
          email: 'vvvtest@email.com',
          recipient_name: 'vvv vvv',
          invitation_code: 'YZPN9dPzemLRE8DAaoyYMugw',
          type: 'ORGANIZATION_MEMBER',
          status: 'OPEN',
          message_type: 'EMAIL',
          sent_at: null,
          entity: null,
        },
      ],
    };
  },

  batchCreateOnlyFailed() {
    return {
      success: [],
      failed: [
        {
          email: 'a@test.com',
          reason: 'INVITATION_EXISTS',
        },
      ],
    };
  },

  batchCreateSuccessAndFailed() {
    return {
      success: [
        {
          id: '6dda1543-fbfb-4fff-9774-2b404baa9f21',
          email: 'vvvtest@email.com',
          recipient_name: 'vvv vvv',
          invitation_code: 'YZPN9dPzemLRE8DAaoyYMugw',
          type: 'ORGANIZATION_MEMBER',
          status: 'OPEN',
          message_type: 'EMAIL',
          sent_at: null,
          entity: null,
        },
      ],
      failed: [
        {
          email: 'a@test.com',
          reason: 'INVITATION_EXISTS',
        },
      ],
    };
  },

  batchDeleteSuccess() {
    return {
      count: 1,
    };
  },
};
