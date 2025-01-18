import { teamMemberSpecification } from '@/features/team-managment/utils';
import { InvitationTypes, ROLE_NAMES } from '@/core/definitions';
import { cloneDeep } from 'lodash-es';

export const initState = {
  admins: [],
  members: [],
  userId: '',
};

export const TeamManagementActions = {
  INIT: 'INIT',
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  SWITCH_ROLE: 'SWITCH_ROLE',
};

export function teamManagementReducer(state = initState, action) {
  let admins, members;
  switch (action.type) {
    case TeamManagementActions.INIT:
      const { invitations, currentUserId } = action.payload;
      const result = invitations.reduce(
        (memo, invitation) => {
          let user = invitation.user;
          let isAdmin;

          if (user) {
            isAdmin = user && teamMemberSpecification.isTeamAdmin(user);
          } else {
            isAdmin = invitation.type === InvitationTypes.ReferralCoordinator;
          }

          if (isAdmin) {
            memo.admins.push(invitation);
          } else {
            memo.members.push(invitation);
          }

          return memo;
        },
        {
          admins: [],
          members: [],
        },
      );

      const findByUserId = currentUserById(currentUserId, 'equal');
      const excludeByUserId = currentUserById(currentUserId);

      return {
        ...initState,
        userId: currentUserId,
        admins: [
          ...result.admins.filter(findByUserId),
          ...result.admins.filter(excludeByUserId).sort(sortBySentAt),
        ],
        members: result.members.sort(sortBySentAt),
      };

    case TeamManagementActions.REMOVE_MEMBER:
      let byId = excludeById(action.payload.invitationId);

      return {
        ...state,
        admins: state.admins.filter(byId),
        members: state.members.filter(byId),
      };

    case TeamManagementActions.SWITCH_ROLE:
      const { invitationId } = action.payload;

      members = state.members;
      admins = state.admins;

      const includeInviteAndHasAUser = ({ id, user }) => id === invitationId && user;
      const byInvitationId = (item) => item.id === invitationId;

      if (members.some(includeInviteAndHasAUser)) {
        admins = cloneDeep(state.admins);

        let member = cloneDeep(members.find(byInvitationId));
        members = members.filter(excludeById(invitationId));
        let user = member.user;
        user.role = ROLE_NAMES.REFERRAL_COORDINATOR;

        admins.push(member);

        const findByUserId = currentUserById(state.userId, 'equal');
        const excludeByUserId = currentUserById(state.userId);

        return {
          ...state,
          admins: [
            ...admins.filter(findByUserId),
            ...admins.filter(excludeByUserId).sort(sortBySentAt),
          ],
          members,
        };
      } else if (admins.some(includeInviteAndHasAUser)) {
        members = cloneDeep(members);

        let admin = cloneDeep(admins.find(byInvitationId));
        admins = admins.filter(excludeById(invitationId));
        let user = admin.user;
        user.role = ROLE_NAMES.TEAM_MEMBER;

        members.push(admin);
        members.sort(sortBySentAt);

        return {
          ...state,
          admins,
          members,
        };
      }

      return {
        ...state,
      };

    default:
      return { ...state };
  }
}

const excludeById = (id) => (invitation) => {
  return invitation.id !== id;
};

function sortBySentAt(left, right) {
  return new Date(right.sentAt) - new Date(left.sentAt);
}

const currentUserById =
  (userId, operation) =>
  ({ user }) => {
    return operation === 'equal' ? user?.id === userId : user?.id !== userId;
  };
