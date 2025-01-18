import { forwardRef } from 'react';
import './ChipRadio.css';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { noop } from '@/core/utils';

const ChipRadio = forwardRef(({ handleClick, label, code, id, className, ...rest }, ref) => {
  return (
    <label className={cn('chip-radio', className)}>
      <input
        aria-label={label}
        id={id}
        ref={ref}
        onClick={(e) => handleClick(e)}
        type="radio"
        className="radio-default"
        data-code={code || id}
        {...rest}
      />
      <div aria-hidden="true" className="chip-button">
        {label}
      </div>
    </label>
  );
});

ChipRadio.propTypes = {
  handleClick: PropTypes.func,
  label: PropTypes.string,
  code: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

ChipRadio.defaultProps = {
  handleClick: noop,
};

ChipRadio.displayName = 'ChipRadio';

export default ChipRadio;
