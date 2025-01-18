import { useState, useEffect } from 'react';
import cn from 'classnames';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import {
  Mail16Regular as Mail,
  CheckmarkCircle16Filled as CheckmarkCircle,
  DismissCircle20Filled as DismissCircle,
  Edit20Filled as Edit,
} from '@fluentui/react-icons';
import { Can } from '@/modules/ability/components';
import { useInvitationSubject } from '@/modules/auth/hooks';
import './PendingResource.css';

export function PendingResource({
  invitation,
  selected,
  highlighted,
  onClick,
  onEdit,
  onRemove,
  ...rest
}) {
  let [shouldHighlight, setShouldHighlight] = useState(highlighted);
  const invitationSubject = useInvitationSubject();

  useEffect(() => {
    if (selected) {
      setShouldHighlight(false);
    }
  }, [selected]);

  const handleRemove = (event) => {
    event.stopPropagation();
    onRemove(invitation.id);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit(invitation);
  };

  return (
    <div
      className={cn('mir-pending-resource', { selected, highlighted: shouldHighlight })}
      onClick={onClick}
      onAnimationEnd={() => setShouldHighlight(false)}
      {...rest}
    >
      <h3 className="font-bold">{invitation.recipient_name}</h3>
      <span>{invitation.email}</span>

      {invitation.status === 'ACCEPTED' ? (
        <span className="badge">
          <CheckmarkCircle className="!text-variant-75" />
          Registration started
        </span>
      ) : invitation.sent_at ? (
        <span className="badge">
          <CheckmarkCircle className="!text-variant-75" />
          Sent {format(new Date(invitation.sent_at), 'MMM d, yyyy')}
        </span>
      ) : (
        <span className="badge">
          <Mail />
          Mail not sent
        </span>
      )}

      <div className="actions">
        <Can I="write" a={invitationSubject}>
          <button
            className="mir-button text"
            disabled={invitation.status === 'ACCEPTED' || invitation.sent_at}
            onClick={handleEdit}
          >
            <Edit />
            <span>Edit</span>
          </button>
        </Can>
        <Can I="delete" a={invitationSubject}>
          <button
            className="mir-button text"
            disabled={invitation.status === 'ACCEPTED'}
            onClick={handleRemove}
          >
            <DismissCircle />
            <span>Remove</span>
          </button>
        </Can>
      </div>
    </div>
  );
}

PendingResource.propTypes = {
  invitation: PropTypes.shape({
    recipient_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['OPEN', 'ACCEPTED', 'DECLINED', 'WITHDRAWN']).isRequired,
    sent_at: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
