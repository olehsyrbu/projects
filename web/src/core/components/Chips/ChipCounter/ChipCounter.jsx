import PropTypes from 'prop-types';
import cn from 'classnames';
import './ChipCounter.css';
import '../../../../styles/components/chip.css';

export function ChipCounter({ label, count, selected, disabled, ...rest }) {
  return (
    <div className={cn('mir-chip', 'counter', { selected: selected || count, disabled })} {...rest}>
      {label}
      <span className="integer">{count && count}</span>
    </div>
  );
}

ChipCounter.propTypes = {
  label: PropTypes.string,
  count: PropTypes.number,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
};
