import { createContext, useCallback, useEffect, useReducer } from 'react';
import { noop } from '@/core/utils';
import { initState, TeamManagementActions, teamManagementReducer } from './teamManagmentReducer';
import PropTypes from 'prop-types';
import { deleteInvitation, fetchOrgTeamInvitations } from '@/core/api/InvitationAPI';
import { useTeamInvitations } from '@/core/api/InvitationQueries';
import { switchRole } from '@/core/api/UserAPI';
import { ROLE_NAMES } from '@/core/definitions';

export const DEFAULT_TEAM_MEMBER_CONTEXT = {
  ...initState,
  add: noop,
  remove: noop,
  toggleRole: noop,
  refreshInvitations: noop,
};

export const TeamMemberContext = createContext(DEFAULT_TEAM_MEMBER_CONTEXT);

export function TeamMembersProvider(props) {
  const { children, organizationId, doRemove, doToggle, userId, doRefreshInvitations } = props;
  const result = useTeamInvitations({ organizationId });
  const [state, dispatch] = useReducer(teamManagementReducer, initState);

  useEffect(() => {
    if (userId && result) {
      dispatch({
        type: TeamManagementActions.INIT,
        payload: {
          invitations: result.items,
          currentUserId: userId,
        },
      });
    }
  }, [result, userId]);

  const remove = useCallback(
    async ({ invitationId }) => {
      dispatch({
        type: TeamManagementActions.REMOVE_MEMBER,
        payload: {
          invitationId,
        },
      });

      try {
        await doRemove({
          ids: [invitationId],
          cascadeUsers: true,
        });
      } catch (error) {
        // TODO: MIR-1954 handle error case, conflict with error boundary
        throw error;
      }
    },
    [doRemove],
  );

  const toggleRole = useCallback(
    async ({ invitationId, userId, role }) => {
      dispatch({
        type: TeamManagementActions.SWITCH_ROLE,
        payload: {
          invitationId,
        },
      });

      try {
        await doToggle(
          userId,
          role === ROLE_NAMES.TEAM_MEMBER
            ? ROLE_NAMES.REFERRAL_COORDINATOR
            : ROLE_NAMES.TEAM_MEMBER,
        );
      } catch (error) {
        // TODO: MIR-1954 handle error case, conflict with error boundary
        throw error;
      }
    },
    [doToggle],
  );

  const refreshInvitations = useCallback(async () => {
    try {
      const result = await doRefreshInvitations({
        organizationId,
      });
      dispatch({
        type: TeamManagementActions.INIT,
        payload: {
          invitations: result.items,
          currentUserId: userId,
        },
      });
    } catch (error) {
      // TODO: MIR-1954 handle error case, conflict with error boundary
      throw error;
    }
  }, [doRefreshInvitations]);

  return (
    <TeamMemberContext.Provider
      value={{
        ...DEFAULT_TEAM_MEMBER_CONTEXT,
        ...state,
        remove,
        toggleRole,
        refreshInvitations,
      }}
    >
      {children}
    </TeamMemberContext.Provider>
  );
}

TeamMembersProvider.propTypes = {
  userId: PropTypes.string.isRequired,
  children: PropTypes.node,
  doRemove: PropTypes.func,
  doToggle: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
};

TeamMembersProvider.defaultProps = {
  doRemove: deleteInvitation,
  doToggle: switchRole,
  doRefreshInvitations: fetchOrgTeamInvitations,
};
