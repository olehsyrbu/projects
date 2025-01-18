import PropTypes from 'prop-types';
import { formatPhoneNumber } from '@/core/utils';
import { AVAILABILITY_TYPES } from '@/core/definitions';

import { AvailabilityBadge, UpdatedWithinDays } from '@/modules/provider/components';
import { useAvailabilityByStatus } from '@/modules/reference-data';
import { getLastUpdatedAt } from '@/modules/provider/utils';

export function ActionsSubDetailsActivated({ email, updatedAt, availability, mobile }) {
  const { name: availabilityName } = useAvailabilityByStatus(availability?.status);
  const lastUpdatedAt = getLastUpdatedAt(updatedAt, availability);
  return (
    <>
      <AvailabilityBadge status={availability?.status} name={availabilityName} />
      <span className="mir-badge-label-text-dash mir-badge">
        <UpdatedWithinDays updatedAt={lastUpdatedAt} />
      </span>
      {mobile && <span className="mir-badge-label-text-dash">{formatPhoneNumber(mobile)}</span>}
      <span className="mir-badge-label-text-dash">{email}</span>
    </>
  );
}

ActionsSubDetailsActivated.defaultProps = {
  email: '',
  mobile: '',
  updatedAt: '',
  availability: {
    status: AVAILABILITY_TYPES.ACCEPTING_NEW_CLIENTS,
  },
};

ActionsSubDetailsActivated.propTypes = {
  email: PropTypes.string,
  mobile: PropTypes.string,
  updatedAt: PropTypes.string,
  availability: PropTypes.shape({
    status: PropTypes.string,
  }),
};
