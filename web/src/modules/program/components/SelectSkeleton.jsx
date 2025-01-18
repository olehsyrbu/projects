import PropTypes from 'prop-types';
import cn from 'classnames';

export function SelectSkeleton({ className }) {
  return <div className={cn('h-12 animate-pulse rounded-lg bg-graphics-30', className)} />;
}

SelectSkeleton.propTypes = {
  className: PropTypes.string,
};
