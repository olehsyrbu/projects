import PropTypes from 'prop-types';
import cn from 'classnames';
import { noop } from '@/core/utils';

import { Dismiss12Filled as Dismiss } from '@fluentui/react-icons';
import './ChipBasic.css';

function ChipBasic({ label, code, compact, className, handleRemove }) {
  return (
    <span
      data-testid="chip-basic"
      className={cn('chip-basic', { compact, [className]: className })}
    >
      <span className="label">{label}</span>
      <button onClick={(e) => handleRemove(e)} data-code={code} type="button" className="remove">
        <Dismiss />
      </button>
    </span>
  );
}

ChipBasic.defaultProps = {
  label: '',
  handleRemove: noop,
};

ChipBasic.propTypes = {
  label: PropTypes.string,
  code: PropTypes.string,
  className: PropTypes.string,
  compact: PropTypes.bool,
  handleRemove: PropTypes.func,
};

export default ChipBasic;
