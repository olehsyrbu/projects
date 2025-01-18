import { useState } from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { Select } from '@/core/components/Select';

export function SelectController({
  name,
  control,
  defaultValue,
  onAfterChange,
  options,
  label,
  ...rest
}) {
  const [value, setValue] = useState(options.find((item) => item.value === defaultValue));
  const { field } = useController({ name, control });

  function handleChange(data) {
    setValue(data);
    field.onChange(data.value);
    onAfterChange({
      name,
      next: data.value,
      prev: field.value,
    });
  }

  return (
    <Select
      label={label}
      options={options}
      className="md:!w-52"
      value={value}
      onChange={handleChange}
      {...rest}
    />
  );
}

SelectController.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object.isRequired,
  onAfterChange: PropTypes.func,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
};
