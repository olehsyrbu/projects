import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { usePaymentOptions } from '@/core/api/ReferenceDataQueries';
import { Checkbox } from '@/core/components/Checkbox';

export function PaymentMethodFilter({ name, control, onAfterChange, methods, modes }) {
  let { field } = useController({ name, control, defaultValue: methods });
  let availableOptions = usePaymentOptions(modes);

  availableOptions = availableOptions.filter(({ code }) => code !== 'insurance');

  function handleChange(code) {
    let newValue = field.value.includes(code)
      ? field.value.filter((c) => c !== code)
      : field.value.concat(code);

    field.onChange(newValue);
    onAfterChange({ name, prev: field.value, next: newValue });
  }

  return (
    <div className="flex flex-col space-y-6">
      {availableOptions.map(({ code, name }) => (
        <Checkbox
          key={code}
          id={`${code}Filter`}
          isSelected={field.value.includes(code)}
          onChange={() => handleChange(code)}
        >
          {name}
        </Checkbox>
      ))}
    </div>
  );
}

PaymentMethodFilter.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  onAfterChange: PropTypes.func,
  modes: PropTypes.array,
  methods: PropTypes.arrayOf(PropTypes.string),
};

PaymentMethodFilter.defaultProps = {
  methods: [],
};
