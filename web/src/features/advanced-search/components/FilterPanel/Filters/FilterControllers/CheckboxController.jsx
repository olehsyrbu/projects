import { useController } from 'react-hook-form';
import { useEffect } from 'react';
import { Checkbox } from '@/core/components/Checkbox';
import PropTypes from 'prop-types';

export function CheckboxController({
  name,
  control,
  defaultValue,
  onAfterChange,
  children,
  className,
  ...rest
}) {
  const { field } = useController({ name, control, defaultValue });

  useEffect(() => {
    if (defaultValue !== field.value) {
      field.onChange(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Checkbox
      className={`${className} checkbox`}
      isSelected={field.value}
      onChange={(isSelected) => {
        field.onChange(isSelected);
        onAfterChange({
          name,
          next: isSelected,
          prev: field.value,
        });
      }}
      {...rest}
    >
      {children}
    </Checkbox>
  );
}

CheckboxController.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  control: PropTypes.object.isRequired,
  onAfterChange: PropTypes.func,
  defaultValue: PropTypes.string,
  children: PropTypes.node,
};
