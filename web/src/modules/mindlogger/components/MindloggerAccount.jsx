import PropTypes from 'prop-types';
import { useMindloggerAccount } from '../hooks';

export function MindloggerAccount({ children, fallback }) {
  const { data, error } = useMindloggerAccount();

  if (error) {
    return fallback;
  }

  // if (data) {
  //   return 'Loading...........';
  // }

  return children;
}

MindloggerAccount.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
};
