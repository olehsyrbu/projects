import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { InputDate } from '@/deprecated/components/FormElements/InputDate/InputDate';

export function InputDateController({ name, control, defaultValue, ...rest }) {
  let { field, fieldState } = useController({ control, name, defaultValue });
  return (
    <InputDate
      value={field.value}
      onChange={field.onChange}
      invalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      {...rest}
    />
  );
}

InputDateController.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
};
