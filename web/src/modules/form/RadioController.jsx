import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Radio } from '@/core/components/Radio';

export function RadioController({ name, control, ...rest }) {
  const { field } = useController({ name, control });
  return <Radio {...rest} {...field} value={rest.value} checked={field.value === rest.value} />;
}

RadioController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
