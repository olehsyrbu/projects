import PropTypes from 'prop-types';

export function ProgramCount({ label, value, onChange }) {
  const classNameButton = 'mir-button !p-0 !w-7 !h-7 !rounded-full';

  return (
    <div className="flex items-center">
      <button
        aria-label="decrement"
        type="button"
        disabled={value <= 0}
        className={classNameButton}
        onClick={() => onChange(value - 1)}
      >
        &minus;
      </button>
      <span
        data-testid="counter"
        className={`w-10 text-center text-hint ${value > 0 && 'font-bold text-regular'}`}
      >
        {value}
      </span>
      <button
        aria-label="increment"
        type="button"
        className={classNameButton}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
      <span className={`ml-6 flex-1 ${value > 0 && 'font-bold'}`}>{label}</span>
    </div>
  );
}

ProgramCount.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.string,
};
