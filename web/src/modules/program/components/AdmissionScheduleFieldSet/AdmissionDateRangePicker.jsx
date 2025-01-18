import { useController, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import { DateRangePicker } from '@/core/components';
import { AddButton, RemoveButton } from '@/modules/program/components';
import { ClearButton } from '../ActionButtons';

export function AdmissionDateRangePicker({ name, control }) {
  let { fields, append, update, remove } = useFieldArray({ name, control });
  let {
    field,
    fieldState: { error },
  } = useController({ name, control });

  // Resolvers don't trigger on useFieldArray changes
  function appendValue(value) {
    append(value);
    field.onChange(field.value.concat(value));
  }

  function updateValue(index, newValue) {
    update(index, newValue);
    field.onChange(field.value.map((value, i) => (i === index ? newValue : value)));
  }

  function removeValue(index) {
    remove(index);
    field.onChange(field.value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div className="-mx-4 divide-x-0 divide-y divide-solid divide-graphics-50 sm:mx-0 sm:space-y-6 sm:divide-y-0">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-4 px-4 py-6 first:pt-0 last:pb-0 sm:flex-row sm:p-0"
          >
            <DateRangePicker
              className="md:max-w-md"
              error={error?.[index]}
              value={field}
              onChange={(date) =>
                fields.length === 0 ? appendValue(date) : updateValue(index, date)
              }
            />
            <div className="flex w-full space-x-2 md:w-28">
              <ClearButton onClick={() => update(index, { start: '', end: '' })} />
              {fields.length > 1 && <RemoveButton onClick={() => removeValue(index)} />}
            </div>
          </div>
        ))}
      </div>

      {error && !Array.isArray(error) && (
        <p className="text-xs font-light text-error-1">{error.message}</p>
      )}

      <AddButton onClick={() => appendValue({ start: '', end: '' })}>
        Add another date range
      </AddButton>
    </div>
  );
}

AdmissionDateRangePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
