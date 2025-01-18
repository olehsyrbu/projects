import { initState, TeamManagementActions, teamManagementReducer } from './teamManagmentReducer';
import { invitationFixture } from '@/tools/test-fixtures';
import { InvitationStatus, InvitationTypes } from '@/core/definitions';

function getInitialData() {
  const firstTeamAdmin = invitationFixture.teamMember({
    id: 'firstTeamAdmin',
    firstName: 'Aydon',
    lastName: 'Carter',
    email: 'john_k@familypractice.com',
    isAdmin: true,
    sentAt: '2021-11-25T07:10:19.697Z',
  });

  const secondTeamAdmin = invitationFixture.teamMember({
    id: 'secondTeamAdmin',
    firstName: 'Bngeborga',
    lastName: 'Smedes',
    email: 'i.smedes@gmail.com',
    isAdmin: true,
    sentAt: '2021-11-23T07:10:19.697Z',
  });

  const firstTeamMember = invitationFixture.teamMember({
    id: 'firstTeamMember',
    firstName: 'Anton',
    lastName: 'Joe',
    email: 'joe@example.com',
    isAdmin: false,
    sentAt: '2021-11-25T07:10:19.697Z',
  });

  const secondTeamMember = invitationFixture.teamMember({
    id: 'secondTeamMember',
    firstName: 'Bill',
    lastName: 'Tomson',
    email: 'bill@example.com',
    isAdmin: false,
    user: {
      id: '4',
    },
    sentAt: '2021-11-23T07:10:19.697Z',
  });

  const thirdTeamAdmin = invitationFixture.invitationWithoutUser({
    id: 'thirdTeamAdmin',
    firstName: 'Yusy',
    lastName: 'Boo',
    email: 'foo@email.com',
    status: InvitationStatus.Open,
    type: InvitationTypes.ReferralCoordinator,
    sentAt: '2021-11-20T07:10:19.697Z',
  });

  return {
    thirdTeamAdmin,
    secondTeamMember,
    firstTeamAdmin,
    firstTeamMember,
    secondTeamAdmin,
  };
}

it('provides default', () => {
  const actual = teamManagementReducer(initState, {});

  expect(actual).toEqual(initState);
});

it('inti with new data and split to members and admins', () => {
  const { thirdTeamAdmin, secondTeamMember, firstTeamAdmin, firstTeamMember, secondTeamAdmin } =
    getInitialData();

  const actual = teamManagementReducer(initState, {
    type: TeamManagementActions.INIT,
    payload: {
      invitations: [
        thirdTeamAdmin,
        secondTeamMember,
        firstTeamAdmin,
        firstTeamMember,
        secondTeamAdmin,
      ],
      currentUserId: 'user-secondTeamAdmin',
    },
  });

  expect(actual).toEqual({
    members: [firstTeamMember, secondTeamMember],
    admins: [secondTeamAdmin, firstTeamAdmin, thirdTeamAdmin],
    userId: 'user-secondTeamAdmin',
  });
});

it('remove admin', () => {
  const { firstTeamAdmin, firstTeamMember, secondTeamAdmin } = getInitialData();

  let actual = teamManagementReducer(null, {
    type: TeamManagementActions.INIT,
    payload: {
      invitations: [firstTeamAdmin, firstTeamMember, secondTeamAdmin],
    },
  });

  actual = teamManagementReducer(actual, {
    type: TeamManagementActions.REMOVE_MEMBER,
    payload: {
      invitationId: secondTeamAdmin.id,
    },
  });

  expect(actual).toMatchSnapshot();
});

it('remove member', () => {
  const { firstTeamAdmin, firstTeamMember, secondTeamAdmin } = getInitialData();

  let actual = teamManagementReducer(null, {
    type: TeamManagementActions.INIT,
    payload: {
      invitations: [firstTeamAdmin, firstTeamMember, secondTeamAdmin],
    },
  });

  actual = teamManagementReducer(actual, {
    type: TeamManagementActions.REMOVE_MEMBER,
    payload: {
      invitationId: firstTeamMember.id,
    },
  });

  expect(actual).toMatchSnapshot();
});

it('promote member to admin', async () => {
  const { firstTeamAdmin, firstTeamMember, secondTeamMember } = getInitialData();

  let actual = teamManagementReducer(null, {
    type: TeamManagementActions.INIT,
    payload: {
      invitations: [firstTeamAdmin, firstTeamMember, secondTeamMember],
    },
  });

  actual = teamManagementReducer(actual, {
    type: TeamManagementActions.SWITCH_ROLE,
    payload: {
      invitationId: secondTeamMember.id,
      isAdmin: true,
    },
  });

  expect(actual).toMatchSnapshot();
});

it('downgrade admin to member', async () => {
  const { firstTeamAdmin, firstTeamMember, secondTeamAdmin } = getInitialData();

  let actual = teamManagementReducer(null, {
    type: TeamManagementActions.INIT,
    payload: {
      invitations: [firstTeamAdmin, firstTeamMember, secondTeamAdmin],
    },
  });

  actual = teamManagementReducer(actual, {
    type: TeamManagementActions.SWITCH_ROLE,
    payload: {
      invitationId: secondTeamAdmin.id,
    },
  });

  expect(actual).toMatchSnapshot();
});
