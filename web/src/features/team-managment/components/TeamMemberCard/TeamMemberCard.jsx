import PropTypes from 'prop-types';
import { useMemo } from 'react';
import format from 'date-fns/format';
import { MailBadge, RecipientCard, SuccessBadge } from '@/modules/invitations/components';
import { noop } from '@/core/utils';
import { DismissCircle20Filled as DismissCircle } from '@fluentui/react-icons';
import { Switch } from '@/core/components/Switch';
import { teamMemberSpecification } from '@/features/team-managment/utils';
import { useAuthContext } from '@/modules/auth';
import { useMatchMedia } from '@/core/hooks';

export function TeamMemberCard({ invitation, user, onRemove, onAdminChange, highlighted }) {
  const auth = useAuthContext();
  const wideScreen = useMatchMedia('(min-width: 768px)');
  const hasUser = user !== null;
  const name = hasUser ? `${user.firstName} ${user.lastName}` : invitation.recipientName;
  const email = hasUser ? user.email : invitation.email;
  const isOwnDisabled = hasUser && auth.user && auth.user.id === user.id;
  const toggleVisibility = useMemo(() => {
    const styles = {};

    if (wideScreen) {
      styles.visibility = hasUser ? 'visible' : 'hidden';
    } else if (!hasUser) {
      styles.display = 'none';
    }

    return styles;
  }, [hasUser, wideScreen]);

  function handleMemberRemoval() {
    onRemove({ invitationId: invitation.id, userId: hasUser ? user.id : null, name });
  }

  function handleMemberAdminChange() {
    if (!hasUser) {
      return;
    }

    onAdminChange({ userId: user.id, invitationId: invitation.id, role: user.role });
  }

  return (
    <RecipientCard
      email={email}
      name={name}
      highlighted={highlighted}
      badge={
        hasUser ? (
          <SuccessBadge label={`Logged in ${format(new Date(user.loggedInAt), 'MMM d, yyyy')}`} />
        ) : (
          <MailBadge label={`Mail sent ${format(new Date(invitation.sentAt), 'MMM d, yyyy')}`} />
        )
      }
      actions={
        <>
          <div style={toggleVisibility}>
            <Switch
              defaultSelected={hasUser ? teamMemberSpecification.isTeamAdmin(user) : false}
              onChange={handleMemberAdminChange}
              isDisabled={isOwnDisabled}
              data-testid="adminSwitch"
            >
              Admin
            </Switch>
          </div>
          <button
            className="mir-button text"
            onClick={handleMemberRemoval}
            disabled={isOwnDisabled}
          >
            <DismissCircle />
            <span>Remove</span>
          </button>
        </>
      }
    />
  );
}

TeamMemberCard.propTypes = {
  invitation: PropTypes.object.isRequired,
  user: PropTypes.object,
  onRemove: PropTypes.func,
  onAdminChange: PropTypes.func,
  highlighted: PropTypes.bool,
};

TeamMemberCard.defaultProps = {
  user: null,
  onRemove: noop,
  onAdminChange: noop,
};
