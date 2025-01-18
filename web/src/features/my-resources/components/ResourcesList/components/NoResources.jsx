import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { InvitationAction, useInvitationSubject } from '@/modules/auth/hooks';
import { Can } from '@/modules/ability/components';

export default function NoResources({ title, message }) {
  const invitationSubject = useInvitationSubject();

  return (
    <div className="no-resources">
      <h2 className="font-bold">{title}</h2>
      <p>{message}</p>
      <Can I={InvitationAction.Create} a={invitationSubject}>
        <Link className="mir-button primary" to="/referral-coordinator/resources/import">
          Add resources
        </Link>
      </Can>
    </div>
  );
}

NoResources.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
