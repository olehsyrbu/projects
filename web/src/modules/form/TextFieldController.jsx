import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import InputText from '@/deprecated/components/FormElements/InputText/InputText';

export function TextFieldController({ control, name, rules, ...rest }) {
  let { field, fieldState } = useController({ control, name, defaultValue: '', rules });

  return (
    <InputText
      value={field.value}
      onChange={field.onChange}
      invalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      {...rest}
    />
  );
}

TextFieldController.propTypes = {
  ...InputText.propTypes,
  control: PropTypes.object,
  name: PropTypes.string,
  rules: PropTypes.object,
};
