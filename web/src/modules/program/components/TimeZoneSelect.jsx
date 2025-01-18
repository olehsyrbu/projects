import { useController } from 'react-hook-form';
import { useTimezones } from '@/core/api/TimezonesQueries';
import { Select } from '@/core/components/Select';
import PropTypes from 'prop-types';

export function TimeZoneSelect({ name, control }) {
  let { field } = useController({ name, control });
  let { timezones } = useTimezones();
  let options = timezones.map(({ label, tzCode }) => ({ value: tzCode, label }));
  let value = options.find((o) => o.value === field.value) || {
    value: field.value,
    label: field.value,
  };
  let onChange = ({ value }) => field.onChange(value);
  return <Select label="Time zone" value={value} onChange={onChange} options={options} />;
}

TimeZoneSelect.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
