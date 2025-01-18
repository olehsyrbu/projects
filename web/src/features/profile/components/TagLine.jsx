import PropTypes from 'prop-types';
import cn from 'classnames';

export function TagLine({ children, className }) {
  return (
    <p
      className={cn(
        'mb-4 max-md:border-t max-md:border-graphics-30 max-md:p-4 max-md:pb-0 md:text-xl',
        className,
      )}
    >
      {children}
    </p>
  );
}

TagLine.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
