import { formatDistanceToNowStrict } from 'date-fns';
import { Clock16Filled as Clock } from '@fluentui/react-icons';
import PropTypes from 'prop-types';

export function UpdatedWithinDays({ updatedAt }) {
  let distance = formatDistanceToNowStrict(new Date(updatedAt), {
    unit: 'day',
    roundingMethod: 'floor',
  });

  return (
    <span className="flex items-center">
      <Clock className="mr-1 mt-0" />
      Updated within {distance}
    </span>
  );
}

UpdatedWithinDays.propTypes = {
  updatedAt: PropTypes.string.isRequired,
};
