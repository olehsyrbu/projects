import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { groupBy, difference, camelCase } from 'lodash-es';
import PropTypes from 'prop-types';
import { useReferenceData } from '@/modules/reference-data';
import { ReferenceDataSelect } from '@/modules/reference-data';

export function AccessibilityFilter({ control, query, dataKey, onAfterChange }) {
  let accommodations = useReferenceData('Accommodation', { types: query.modes });
  let groups = groupBy(accommodations, 'category');

  let { field, fieldState } = useController({
    control,
    name: 'accommodation',
    defaultValue: query.accommodation,
  });

  useEffect(() => {
    if (query.accommodation !== field.value) {
      field.onChange(query.accommodation);
    }
  }, [query.accommodation]);

  function handleAfterChange({ next, prev }) {
    onAfterChange({ name: field.name, dataKey, next, prev });
  }

  const fieldSelect = {
    name: field.name,
    defaultValue: field.value,
    onChange: field.onChange,
    invalid: fieldState.invalid,
    errorMessage: fieldState.error?.message,
    dataKey,
    onAfterChange: handleAfterChange,
  };
  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([label, options]) => (
        <RefDataSelect
          key={label}
          label={label}
          options={options}
          id={`${camelCase(label)}Filter`}
          {...fieldSelect}
        />
      ))}
    </div>
  );
}

function RefDataSelect({ onAfterChange, dataKey, defaultValue, onChange, ...rest }) {
  function getValue() {
    return rest.options.filter(({ code }) => defaultValue.includes(code));
  }

  const [value, setValue] = useState(getValue());

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(getValue());
    }
  }, [defaultValue, rest.options]);

  function handleChange(values) {
    setValue(values);
    const nextCodes = values.map((v) => v.code);
    const valueCodes = value.map((v) => v.code);
    const differenceCodes = difference(valueCodes, nextCodes);
    const newCodes = defaultValue.filter((code) => !differenceCodes.includes(code));
    onChange([...new Set([...newCodes, ...nextCodes])]);
    onAfterChange({ next: [...new Set([...newCodes, ...nextCodes])], prev: defaultValue });
  }

  return <ReferenceDataSelect isMulti value={value} onChange={handleChange} {...rest} />;
}

RefDataSelect.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  control: PropTypes.object,
  name: PropTypes.string,
  dataKey: PropTypes.string,
  defaultValue: PropTypes.array,
  onChange: PropTypes.func,
  onAfterChange: PropTypes.func,
};

AccessibilityFilter.propTypes = {
  onAfterChange: PropTypes.func,
  name: PropTypes.string,
  dataKey: PropTypes.string,
  control: PropTypes.object.isRequired,
  query: PropTypes.shape({
    modes: PropTypes.array,
    accommodation: PropTypes.array,
  }),
};

AccessibilityFilter.defaultProps = {
  query: {
    accommodation: [],
  },
};
