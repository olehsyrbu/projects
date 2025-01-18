import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './Radio.css';

export const Radio = forwardRef(({ children, className, ...rest }, ref) => {
  return (
    <label className={cn('mir-radio', className, { disabled: rest.disabled })}>
      <input type="radio" ref={ref} className="mir-radio-input" {...rest} />
      <div className="mir-radio-marker" />
      {children}
    </label>
  );
});

Radio.displayName = 'Radio';
Radio.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
