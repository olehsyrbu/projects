import PropTypes from 'prop-types';
import InputText from '../InputText/InputText';

export function InputDate({ label, value, onChange, invalid, format, formatClassName, ...rest }) {
  function handleOnChange(event) {
    let expiration = event.target.value;
    const len = expiration.length;
    const slashCount = expiration.split('/').length;
    const addSlash = slashCount < 3 && (len === 3 || len === 6) && expiration[len - 1] !== '/';

    if (addSlash) {
      expiration = expiration.substr(0, len - 1) + '/' + expiration.substr(len - 1, 1);
    }
    onChange(expiration);
  }

  function handleOnKeyDown(e) {
    const expiration = e.target.value;
    if (
      e.shiftKey ||
      (e.which !== 8 &&
        e.which !== 9 &&
        e.which !== 0 &&
        e.which !== 37 &&
        e.which !== 39 &&
        e.which < 48) ||
      (e.which > 57 && e.which !== 191) ||
      (expiration.length === 10 && e.which >= 48 && e.which <= 57)
    ) {
      e.preventDefault();
    }

    if (expiration.length === 10 && e.which === 191) {
      e.preventDefault();
    }
  }

  return (
    <InputText
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      label={label}
      value={value}
      invalid={invalid}
      {...rest}
    >
      {format && <p className={`text-hint ${formatClassName}`}>Use MM/DD/YYYY date format</p>}
    </InputText>
  );
}

InputDate.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  formatClassName: PropTypes.string,
  format: PropTypes.string,
  onChange: PropTypes.func,
  invalid: PropTypes.bool,
};
