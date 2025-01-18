import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Heart24Regular as Heart, Heart24Filled as HeartFilled } from '@fluentui/react-icons';

export const Favorite = forwardRef(({ className, ...rest }, ref) => {
  return (
    <label
      className={`inline-block cursor-pointer ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input type="checkbox" className="peer sr-only" {...rest} ref={ref} />
      <HeartFilled className="!hidden text-favorites peer-checked:!inline-block" />
      <Heart className="text-p-100 peer-checked:!hidden" />
    </label>
  );
});

Favorite.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
};
Favorite.defaultProps = {
  checked: undefined,
  defaultChecked: undefined,
  className: '',
};
