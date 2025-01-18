import { DatePicker } from '@/core/components';
import PropTypes from 'prop-types';
import { useState } from 'react';
import isAfter from 'date-fns/isAfter';
import format from 'date-fns/format';

export function DateRangePicker({ value, onChange, error, labelStart, labelEnd, className }) {
  const [start, setStart] = useState(value.start);
  const [end, setEnd] = useState(value.end);

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  return (
    <div className={`flex w-full flex-col space-y-4 md:flex-row md:space-y-0 ${className}`}>
      <DatePicker
        wrapperClassName="mr-0 md:mr-6"
        label={labelStart}
        selectsStart
        value={start}
        error={error?.start}
        startDate={startDate}
        endDate={endDate}
        onChange={(date) => {
          const endDateUpdated = isAfter(new Date(date), new Date(end)) ? date : end;
          setStart(date);
          setEnd(endDateUpdated);
        }}
        onBlur={() => {
          onChange({ start, end });
        }}
        onSelect={(date) => {
          const startDateUpdated = date ? format(date, 'yyyy-MM-dd') : null;
          const endDateUpdated = isAfter(new Date(startDateUpdated), new Date(end))
            ? startDateUpdated
            : end;
          setStart(startDateUpdated);
          setEnd(endDateUpdated);
          onChange({ start: startDateUpdated, end: endDateUpdated });
        }}
      />
      <DatePicker
        label={labelEnd}
        error={error?.end}
        value={end}
        selectsEnd
        startDate={startDate}
        minDate={startDate}
        endDate={endDate}
        disabled={!start}
        onChange={(end) => {
          setEnd(end);
        }}
        onBlur={() => {
          onChange({ start, end });
        }}
        onSelect={(date) => {
          const endDateUpdated = date ? format(date, 'yyyy-MM-dd') : null;
          setEnd(endDateUpdated);
          onChange({ start, end: endDateUpdated });
        }}
      />
    </div>
  );
}

DateRangePicker.propTypes = {
  value: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  onChange: PropTypes.func,
  className: PropTypes.string,
  labelStart: PropTypes.string,
  labelEnd: PropTypes.string,
  error: PropTypes.shape({
    start: PropTypes.object,
    end: PropTypes.object,
  }),
};

DateRangePicker.defaultProps = {
  labelStart: 'From',
  labelEnd: 'To',
  value: { start: null, end: null },
  onChange: () => {},
};
