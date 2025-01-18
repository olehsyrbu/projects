import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { noop } from '@/core/utils';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import { TeamMemberContext } from '../TeamMembersProvider';
import { TeamMemberCard } from '../TeamMemberCard';
import './ListTeamMembers.css';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';

const DEFAULT_CONFIRMATION = {
  isOpen: false,
  name: '',
  invitationId: null,
};

export function ListTeamMembers({ onNewTeamMember }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { admins, members, remove, toggleRole, refreshInvitations } = useContext(TeamMemberContext);

  const [confirmation, setConfirmation] = useState(DEFAULT_CONFIRMATION);
  const [highlightMembersCount, setHighlightMembersCount] = useState(0);

  let highlightCount = location.state?.highlight ?? 0;

  useEffect(() => {
    if (highlightCount > 0) {
      refreshInvitations();
    }
  }, []);

  useEffect(() => {
    if (highlightCount > 0) {
      setHighlightMembersCount(highlightCount);
      navigate(location.pathname, { replace: true });
    }
  }, [members]);

  function handleConfirmDialog() {
    if (confirmation.invitationId) {
      remove({ invitationId: confirmation.invitationId });
    }

    setConfirmation({
      ...DEFAULT_CONFIRMATION,
    });
  }

  function handleCloseDialog() {
    setConfirmation({
      ...DEFAULT_CONFIRMATION,
    });
  }

  function handleMemberRemove({ invitationId, name }) {
    setConfirmation({
      isOpen: true,
      name,
      invitationId,
    });
  }

  function handleAdminChange({ invitationId, userId, role }) {
    toggleRole({ invitationId, userId, role });
  }

  return (
    <Page className="mir-list-member">
      <Heading>
        <h1>Manage my team</h1>
      </Heading>
      <Content>
        <section>
          <h2 className="font-bold">Admins</h2>
          <div data-testid="adminGroup">
            {admins.length !== 0
              ? admins.map((member) => {
                  return (
                    <TeamMemberCard
                      key={member.id}
                      invitation={member}
                      user={member.user}
                      onRemove={handleMemberRemove}
                      onAdminChange={handleAdminChange}
                    />
                  );
                })
              : 'Loading...'}
          </div>
        </section>
        {members.length !== 0 && (
          <section>
            <h2 className="font-bold">Team members</h2>
            <div data-testid="memberGroup">
              {members.map((member, index) => {
                return (
                  <TeamMemberCard
                    key={member.id}
                    invitation={member}
                    user={member.user}
                    onRemove={handleMemberRemove}
                    onAdminChange={handleAdminChange}
                    highlighted={index < highlightMembersCount}
                  />
                );
              })}
            </div>
          </section>
        )}
        <Dialog isOpen={confirmation.isOpen} onDismiss={handleCloseDialog} width={500}>
          <DialogTitle>Remove team member</DialogTitle>
          <DialogContent>
            {`Removing this team member means they will no longer be on your team. Are you sure you want to remove them?`}
          </DialogContent>
          <DialogActions>
            <button className="mir-button" onClick={handleConfirmDialog}>
              Confirm
            </button>
            <button className="mir-button primary" onClick={handleCloseDialog}>
              Cancel
            </button>
          </DialogActions>
        </Dialog>
      </Content>
      <Actions>
        <button className="mir-button" onClick={onNewTeamMember}>
          Add team members
        </button>
      </Actions>
    </Page>
  );
}

ListTeamMembers.propTypes = {
  onNewTeamMember: PropTypes.func,
};

ListTeamMembers.defaultProps = {
  onNewTeamMember: noop,
};
