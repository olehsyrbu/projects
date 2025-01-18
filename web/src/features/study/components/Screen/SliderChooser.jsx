import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { StepSlider } from '@/core/components/StepSlider';

export function SliderChooser({ control, name, options, fromLabel, toLabel }) {
  const { field } = useController({
    control,
    name,
    defaultValue: false,
    rules: { required: true },
  });

  return (
    <div className="flex items-center">
      {fromLabel ? <span className="mr-6">{fromLabel}</span> : null}
      <StepSlider
        aria-label={name}
        className="flex-1"
        value={field.value}
        onChange={field.onChange}
        minValue={1}
        maxValue={options.length}
      />
      {toLabel ? <span className="ml-6">{toLabel}</span> : null}
    </div>
  );
}

SliderChooser.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  fromLabel: PropTypes.string,
  toLabel: PropTypes.string,
};

SliderChooser.defaultProps = {
  options: [],
};
