import { forwardRef, useMemo } from 'react';
import ReactDatePicker from 'react-datepicker';
import cn from 'classnames';
import format from 'date-fns/format';
import addYears from 'date-fns/addYears';
import PropTypes from 'prop-types';

import InputText from '@/deprecated/components/FormElements/InputText/InputText';
import { CalendarLtr24Filled as CalendarLtr } from '@fluentui/react-icons';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

const DATE_FORMAT = 'MM/dd/yyyy';
const InputDatePicker = forwardRef(({ className, ...rest }, ref) => {
  const classNames = cn('w-full text-p-100', {
    'text-graphics-50 cursor-not-allowed': rest.disabled,
    [className]: className,
  });

  return (
    <InputText ref={ref} inputClassName={classNames} {...rest}>
      <CalendarLtr className="absolute right-3 top-3" onClick={rest.onClick} />
    </InputText>
  );
});

InputDatePicker.propTypes = {
  className: PropTypes.string,
};

export function DatePicker({ value, onChange, error, label, minYears, maxYears, ...rest }) {
  let selected = useMemo(() => (value ? new Date(value) : null), [value]);

  function handleChange(value) {
    onChange(value ? format(new Date(value), 'yyyy-MM-dd') : null);
  }

  const handleRawChange = (e) => {
    let newValue = e.target.value;
    if (newValue) {
      const len = newValue.length;
      const slashCount = newValue.split('/').length;
      const addSlash = slashCount < 3 && (len === 3 || len === 6) && newValue[len - 1] !== '/';

      if (len === 8 && newValue.indexOf('/') === -1) {
        newValue = `${newValue.slice(0, 2)}/${newValue.slice(2, 4)}/${newValue.slice(4, 8)}`;
      } else if (addSlash) {
        newValue = newValue.substr(0, len - 1) + '/' + newValue.substr(len - 1, 1);
      }

      if (/^[0-9/]*$/.test(newValue) && len <= 10) {
        e.target.value = newValue;
        if (newValue.length === 10) {
          handleChange(newValue);
        }
      } else {
        e.preventDefault();
      }
    }
  };

  return (
    <ReactDatePicker
      utcOffset={0}
      formatWeekDay={(day) => day[0]}
      dateFormat={DATE_FORMAT}
      selected={selected}
      onChange={handleChange}
      customInput={<InputDatePicker label={label} invalid={error} errorMessage={error?.message} />}
      onChangeRaw={handleRawChange}
      showMonthDropdown
      minDate={addYears(new Date(), minYears)}
      maxDate={addYears(new Date(), maxYears)}
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={50}
      {...rest}
    />
  );
}

DatePicker.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.object,
  minYears: PropTypes.number,
  maxYears: PropTypes.number,
};

DatePicker.defaultProps = {
  value: null,
  label: '',
  onChange: () => {},
  minYears: -25,
  maxYears: 25,
};
