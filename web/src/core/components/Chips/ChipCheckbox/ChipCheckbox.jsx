import { forwardRef } from 'react';
import './ChipCheckbox.css';
import PropTypes from 'prop-types';

const ChipCheckbox = forwardRef(({ label, code, className, handleClick, id, ...rest }, ref) => {
  return (
    <label className="chip-checkbox">
      <input
        aria-label={label}
        id={id}
        ref={ref}
        onClick={handleClick}
        type="checkbox"
        className={`checkbox-default ${className}`}
        data-code={code}
        data-id={id}
        {...rest}
      />
      <div className="chip-button" aria-hidden="true">
        {label}
      </div>
    </label>
  );
});

ChipCheckbox.propTypes = {
  label: PropTypes.string,
  code: PropTypes.string,
  className: PropTypes.string,
  handleClick: PropTypes.func,
  id: PropTypes.string,
};

ChipCheckbox.displayName = 'ChipCheckbox';

export default ChipCheckbox;
