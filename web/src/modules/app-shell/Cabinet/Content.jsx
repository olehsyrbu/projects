import PropTypes from 'prop-types';
import cn from 'classnames';

export function Content({ children, surface, className }) {
  return <div className={cn('mir-cabinet-content', { surface }, className)}>{children}</div>;
}
Content.propTypes = {
  surface: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};
