import React, { forwardRef } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

export let NumberInput = forwardRef(
  ({ className, inputClassName, name, onChange, invalid, ...rest }, ref) => {
    function handleChange(e) {
      onChange(Number(e.target.value).toString());
    }

    const classNames = cn(
      'pointer-events-none absolute inset-0 rounded-lg border border-solid border-graphics-50',
      'peer-hover:border-2 peer-hover:border-p-120',
      'peer-focus:border-2 peer-focus:border-p-100',
      'peer-disabled:border peer-disabled:border-graphics-50',
      {
        'peer-focus:border-error-3 border-error-1 peer-hover:border-error-1': invalid,
      },
    );
    return (
      <div className={cn('relative', className)}>
        <input
          ref={ref}
          className={cn(
            'm-0 box-border inline-block w-full rounded-lg border-0 p-3 px-2 text-center text-base outline-none [&::-webkit-inner-spin-button]:hidden',
            inputClassName,
          )}
          {...rest}
          type="number"
          onChange={handleChange}
        />
        <div className={classNames} />
      </div>
    );
  },
);

NumberInput.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
};
