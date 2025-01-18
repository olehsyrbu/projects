import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { Select } from '@/core/components/Select';

export function SelectController({ control, name, ...rest }) {
  let { field, fieldState } = useController({
    control,
    name,
    defaultValue: rest.isMulti ? [] : null,
  });

  const onChange = rest.onChange || field.onChange;
  return (
    <Select
      value={field.value}
      onChange={onChange}
      invalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      {...rest}
    />
  );
}

SelectController.propTypes = {
  ...Select.propTypes,
  control: PropTypes.object,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
};
