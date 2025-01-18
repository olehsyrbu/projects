import PropTypes from 'prop-types';

export function Actions({ children }) {
  return <div className="mir-cabinet-actions">{children}</div>;
}

Actions.propTypes = {
  children: PropTypes.node,
};
