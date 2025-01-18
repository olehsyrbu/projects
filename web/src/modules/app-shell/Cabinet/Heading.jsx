import PropTypes from 'prop-types';
import cn from 'classnames';
export function Heading({ children, className }) {
  return <div className={cn('mir-cabinet-heading', className)}>{children}</div>;
}

Heading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
