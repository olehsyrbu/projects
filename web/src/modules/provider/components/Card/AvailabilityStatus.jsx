import * as PropTypes from 'prop-types';
import cn from 'classnames';
import {
  CheckmarkCircle16Filled as CheckmarkCircle,
  DismissCircle16Filled as DismissCircle,
} from '@fluentui/react-icons';

export function AvailabilityStatus({ status }) {
  let message = 'Check for availability';
  let icon = null;
  let isAvailable = status === 'ACCEPTING_NEW_CLIENTS';

  if (isAvailable) {
    message = 'Spots available';
    icon = <CheckmarkCircle />;
  } else if (status === 'NOT_ACCEPTING_NEW_CLIENTS') {
    message = 'No spots available';
    icon = <DismissCircle />;
  }

  return (
    <span className={cn('feature availability', { available: isAvailable })}>
      {icon} {message}
    </span>
  );
}

AvailabilityStatus.propTypes = {
  status: PropTypes.oneOf(['ACCEPTING_NEW_CLIENTS', 'NOT_ACCEPTING_NEW_CLIENTS', 'PLEASE_INQUIRE']),
};
