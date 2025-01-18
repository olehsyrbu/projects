import { useController } from 'react-hook-form';
import ChipCheckbox from '@/core/components/Chips/ChipCheckbox';
import PropTypes from 'prop-types';

export function ChipCheckboxController({ name, control, onChange, ...rest }) {
  let multiple = rest.hasOwnProperty('value');

  let { field } = useController({ name, control, defaultValue: multiple ? [] : false });
  let { value, ...fieldRest } = field;

  function handleChange(e) {
    if (onChange) {
      onChange(e);
    }
    fieldRest.onChange(e);
  }

  if (!multiple) {
    return <ChipCheckbox {...rest} {...fieldRest} onChange={handleChange} checked={value} />;
  }

  return (
    <ChipCheckbox
      {...rest}
      {...fieldRest}
      checked={value.includes(rest.value)}
      onChange={(event) => {
        if (event.target.checked) {
          field.onChange(value.concat(rest.value));
        } else {
          field.onChange(value.filter((v) => v !== rest.value));
        }
      }}
    />
  );
}

ChipCheckboxController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  onChange: PropTypes.func,
};
