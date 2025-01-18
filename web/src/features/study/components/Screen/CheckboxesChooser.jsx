import { useState } from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { Checkbox } from '@/core/components/Checkbox';

export function CheckboxesChooser({ control, name, options }) {
  const { field } = useController({ control, name, rules: { required: true } });
  const [value, setValue] = useState(field.value || []);
  const inRowClass = options.length <= 5 ? 'md:flex-row md:space-y-0 md:space-x-4' : '';

  return (
    <div className={`flex flex-col space-y-4 ${inRowClass}`}>
      {options.map((option, index) => {
        return (
          <Checkbox
            key={`${name}/${index}`}
            defaultSelected={value.includes(option.value)}
            name={option.name.en}
            value={option.value}
            onChange={(isSelected) => {
              const valueCopy = [...value];

              if (isSelected) {
                valueCopy[index] = Number(option.value);
              } else {
                valueCopy.splice(index, 1);
              }

              field.onChange(valueCopy);
              setValue(valueCopy);
            }}
          >
            {option.name.en}
          </Checkbox>
        );
      })}
    </div>
  );
}

CheckboxesChooser.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
};

CheckboxesChooser.defaultProps = {
  options: [],
};
