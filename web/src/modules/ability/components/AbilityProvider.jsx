import PropTypes from 'prop-types';
import { AbilityContext } from './AbilityContext';
import { toAbility } from '../utils';

export function AbilityProvider(props) {
  const { rules, children } = props;

  return <AbilityContext.Provider value={toAbility(rules)}>{children}</AbilityContext.Provider>;
}

AbilityProvider.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};

AbilityProvider.defaultProps = {
  rules: [],
};
