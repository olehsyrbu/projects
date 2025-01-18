import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Radio } from '@/core/components/Radio';

export function RadiosChooser({ control, name, options }) {
  const { field } = useController({ control, name, rules: { required: true } });

  return (
    <div className="flex flex-wrap gap-4 max-md:flex-col">
      {options.map((option, index) => {
        return (
          <Radio
            key={`${name}/${index}`}
            checked={field.value === option.value}
            name={option.name.en}
            value={String(option.value)}
            onChange={(event) => {
              field.onChange(Number(event.target.value));
            }}
          >
            {option.name.en}
          </Radio>
        );
      })}
    </div>
  );
}

RadiosChooser.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
};

RadiosChooser.defaultProps = {
  options: [],
};
