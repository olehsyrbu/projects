import { useState } from 'react';
import PropTypes from 'prop-types';
import { useController, useFormContext } from 'react-hook-form';
import { useReferenceData } from '@/modules/reference-data';
import { ReferenceDataSelect } from '@/modules/reference-data';

export function ReferenceDataSelectController({
  defaultValue,
  name,
  onAfterChange,
  type,
  label,
  modes,
  isMulti,
  className,
  sort,
  ...rest
}) {
  let referenceData = useReferenceData(type, { types: modes }, sort);

  const { control } = useFormContext();
  const { field } = useController({ name, control });

  const stateValues = isMulti
    ? referenceData.filter(({ code }) => defaultValue.includes(code))
    : referenceData.find(({ code }) => code === defaultValue);

  const [values, setValues] = useState(stateValues);

  function handleOnChange(items) {
    let next = isMulti ? items.map((i) => i.code) : items.code;
    field.onChange(next);
    setValues(items);
    onAfterChange({
      name,
      next,
      prev: field.value,
    });
  }

  return (
    <div className={className}>
      <ReferenceDataSelect
        isMulti={isMulti}
        options={referenceData}
        value={values}
        label={label}
        onChange={handleOnChange}
        {...rest}
      />
    </div>
  );
}

ReferenceDataSelectController.defaultProps = {
  isMulti: true,
};

ReferenceDataSelectController.propTypes = {
  defaultValue: PropTypes.array,
  className: PropTypes.string,
  name: PropTypes.string,
  onAfterChange: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
  modes: PropTypes.array,
  isMulti: PropTypes.bool,
  sort: PropTypes.object,
};
