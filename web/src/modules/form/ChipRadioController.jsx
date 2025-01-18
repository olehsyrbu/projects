import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import ChipRadio from '@/core/components/Chips/ChipRadio';

export function ChipRadioController({ name, control, ...rest }) {
  const { field } = useController({ name, control });
  return <ChipRadio {...rest} {...field} value={rest.value} checked={field.value === rest.value} />;
}

ChipRadioController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
