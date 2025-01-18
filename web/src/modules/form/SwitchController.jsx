import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Switch } from '@/core/components/Switch';

export function SwitchController({ name, control, value, ...rest }) {
  const { field } = useController({ name, control, defaultValue: false });
  return <Switch {...rest} {...field} value={value} isSelected={field.value} />;
}

SwitchController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  value: PropTypes.string,
};
