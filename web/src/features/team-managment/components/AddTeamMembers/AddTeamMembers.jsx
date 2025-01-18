import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import { AddResourcesForm } from '@/modules/invitations/components';
import { InvitationTypes } from '@/core/definitions';

export function AddTeamMembers({ onAddToTeam, organizationId, onCancel }) {
  return (
    <Page>
      <Heading>
        <h1 className="font-bold">Add team members</h1>
      </Heading>
      <Content surface>
        <AddResourcesForm
          invitationType={InvitationTypes.OrganizationMember}
          organizationId={organizationId}
          shouldSendInvitations
          onSuccess={onAddToTeam}
          entityLabel="team member"
          submitActionLabel="Add to team"
          failedMessage="These team members are already registered"
          successMessage="New team members have been added"
        />
      </Content>
      <Actions>
        <button className="mir-button" onClick={onCancel}>
          Cancel
        </button>
      </Actions>
    </Page>
  );
}

AddTeamMembers.propTypes = {
  onAddToTeam: PropTypes.func,
  onCancel: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
};

AddTeamMembers.defaultProps = {
  onAddToTeam: noop,
  onCancel: noop,
};
