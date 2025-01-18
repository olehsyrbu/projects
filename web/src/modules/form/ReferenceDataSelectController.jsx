import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ReferenceDataSelect } from '@/modules/reference-data';

export function ReferenceDataSelectController({ control, name, hideError, ...rest }) {
  let { field, fieldState } = useController({
    control,
    name,
  });
  const onChange = rest.onChange || field.onChange;
  return (
    <ReferenceDataSelect
      value={field.value}
      onChange={onChange}
      invalid={fieldState.invalid}
      errorMessage={hideError ? null : fieldState.error?.message}
      {...rest}
    />
  );
}

ReferenceDataSelectController.propTypes = {
  control: PropTypes.object,
  hideError: PropTypes.bool,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
};
