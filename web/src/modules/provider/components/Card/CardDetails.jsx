import PropTypes from 'prop-types';
import { formatPhoneNumber } from '@/core/utils';
import { Dot } from '@/core/components';
import { UpdatedWithinDays, AvailabilityBadge } from '@/modules/provider/components';
import { getLastUpdatedAt } from '@/modules/provider/utils';

export function CardDetails({
  email,
  mobile,
  note,
  preferredContacts,
  availability,
  deactivated,
  updatedAt,
}) {
  const lastUpdatedAt = getLastUpdatedAt(updatedAt, availability);

  return (
    <div className="flex-3">
      <span className="flex flex-wrap items-center text-sm">
        <AvailabilityBadge
          status={availability?.status}
          className="mr-4"
          deactivated={deactivated}
        />

        <UpdatedWithinDays updatedAt={lastUpdatedAt} />

        {preferredContacts?.includes('EMAIL') && email && (
          <span className="inline-flex items-center">
            <Dot />
            {email}
          </span>
        )}

        {preferredContacts?.includes('MOBILE') && mobile && (
          <span className="inline-flex items-center">
            <Dot />
            {formatPhoneNumber(mobile)}
          </span>
        )}
      </span>
      {note && (
        <p className="!mt-0 break-all pt-2">
          <b>Note:</b> <span>{note}</span>
        </p>
      )}
    </div>
  );
}

CardDetails.propTypes = {
  email: PropTypes.string,
  mobile: PropTypes.string,
  availability: PropTypes.shape({
    status: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  note: PropTypes.string,
  preferredContacts: PropTypes.array,
  deactivated: PropTypes.bool,
  updatedAt: PropTypes.string,
};

CardDetails.defaultProps = {
  preferredContacts: [],
  deactivated: false,
};
