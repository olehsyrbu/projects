import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { DatePicker } from '@/core/components';

export function DatePickerController({ name, control, ...rest }) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return <DatePicker {...rest} {...field} error={error} />;
}

DatePickerController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
