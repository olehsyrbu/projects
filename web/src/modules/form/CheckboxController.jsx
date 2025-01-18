import { useController } from 'react-hook-form';
import { Checkbox } from '@/core/components/Checkbox';
import PropTypes from 'prop-types';

export function CheckboxController({ name, control, ...rest }) {
  let multiple = rest.hasOwnProperty('value');

  let { field } = useController({ name, control, defaultValue: multiple ? [] : false });
  let { value, ...fieldRest } = field;

  if (!multiple) {
    return <Checkbox {...rest} {...fieldRest} isSelected={value} />;
  }

  return (
    <Checkbox
      {...rest}
      {...fieldRest}
      isSelected={value.includes(rest.value)}
      onChange={(isSelected) => {
        if (isSelected) {
          field.onChange(value.concat(rest.value));
        } else {
          field.onChange(value.filter((v) => v !== rest.value));
        }
      }}
    />
  );
}

CheckboxController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
