import PropTypes from 'prop-types';
import { Badge } from '@/core/components';
import { Location24Regular as Location } from '@fluentui/react-icons';

export function Distance({ distance }) {
  const roundedDistance = distance > 100 ? '100+' : String(Math.round(distance));

  return distance ? (
    <Badge icon={<Location />} label={`${roundedDistance} mi`} className="gray-svg" />
  ) : null;
}

Distance.propTypes = {
  distance: PropTypes.string,
};
