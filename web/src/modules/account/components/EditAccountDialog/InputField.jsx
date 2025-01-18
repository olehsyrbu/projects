import { useController } from 'react-hook-form';
import InputText from '@/deprecated/components/FormElements/InputText/InputText';

export function InputField({ name, defaultValue, rules, ...rest }) {
  let {
    field,
    fieldState: { error },
  } = useController({ name, rules, defaultValue });
  let errorMessage = getErrorMessage(error);

  return <InputText {...field} {...rest} invalid={!!error} errorMessage={errorMessage} />;
}

function getErrorMessage(error) {
  if (error?.message) {
    return error.message;
  }

  switch (error?.type) {
    case 'required':
      return 'This field is required';
    case 'emailFormat':
      return 'Please enter valid email address';
    case 'emailConfirm':
      return `Email confirmation doesn't match the email`;
    case 'passwordConfirm':
      return `Password confirmation doesn't match the password`;
    case 'passwordStrength':
      return 'Password must have at least 8 characters, 1 lower case letter, 1 upper case letter, 1 number';
    default:
      return '';
  }
}
