import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextArea } from '@/core/components/TextArea';

export function TextAreaController({ name, control, rules, ...rest }) {
  let { field, fieldState } = useController({ name, control, rules, defaultValue: '' });
  return <TextArea {...rest} {...field} errorMessage={fieldState.error?.message} />;
}

TextAreaController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  rules: PropTypes.object,
};
