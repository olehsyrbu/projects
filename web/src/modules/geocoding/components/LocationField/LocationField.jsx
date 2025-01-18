import PropTypes from 'prop-types';
import { useScreen } from '@/core/hooks';
import { LocationFieldDesktop, LocationFieldMobile } from '../LocationField';

export function LocationField(props) {
  return useScreen('md') ? <LocationFieldDesktop {...props} /> : <LocationFieldMobile {...props} />;
}

LocationField.propTypes = {
  onSelectLocation: PropTypes.func,
  defaultValue: PropTypes.string,
  errorMessage: PropTypes.string,
  invalid: PropTypes.bool,
  required: PropTypes.bool,
};
