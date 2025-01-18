import PropTypes from 'prop-types';
import cn from 'classnames';
import { Availability } from './Availability';

export function AvailabilityBadge({ status, className, deactivated }) {
  return deactivated ? (
    <span className={cn('rounded-full bg-n-40 px-3 font-bold', className)}>Deactivated</span>
  ) : (
    <Availability status={status} className={className} />
  );
}

AvailabilityBadge.propTypes = {
  status: PropTypes.string,
  className: PropTypes.string,
  deactivated: PropTypes.bool,
};
