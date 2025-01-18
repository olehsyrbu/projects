import PropTypes from 'prop-types';
import { useController, useFieldArray } from 'react-hook-form';
import { TextField } from '@/modules/form';
import { AddButton, ClearButton, RemoveButton } from './ActionButtons';
import { array, mixed, object, string } from 'yup';
import isValid from 'date-fns/isValid';
import isFuture from 'date-fns/isFuture';
import { DateRangePicker } from '@/core/components';

export function AccreditationFieldSet({ name, control }) {
  let { fields, append, update, remove } = useFieldArray({ name, control });
  const defaultAccreditation = {
    body: '',
    accreditedAt: '',
    expiredAt: '',
    state: fields[0].state,
  };
  let {
    field,
    fieldState: { error },
  } = useController({ name, control });

  function appendValue(value) {
    append(value);
    field.onChange(field.value.concat(value));
  }

  function updateValue(index, { start, end }) {
    let newValue = { ...field.value[index], accreditedAt: start || '', expiredAt: end || '' };
    update(index, newValue);
    field.onChange(field.value.map((value, i) => (i === index ? newValue : value)));
  }

  function removeValue(index) {
    remove(index);
    field.onChange(field.value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
        {fields.map((accreditation, index) => {
          const errorState = {
            start: error?.[index]?.accreditedAt,
            end: error?.[index]?.expiredAt,
          };

          const value = {
            start: accreditation.accreditedAt,
            end: accreditation.expiredAt,
          };

          return (
            <div
              key={accreditation.id}
              className="-mx-4 flex flex-col items-baseline gap-4 px-4 py-6 first:pt-0 last:pb-0 md:mx-0 md:flex-row md:px-0"
            >
              <fieldset className="flex w-full flex-col gap-4 md:max-w-md">
                <TextField
                  inputClassName="basis-full"
                  label="Accrediting body"
                  name={`${name}.${index}.body`}
                  control={control}
                />
                <div className="flex flex-col md:flex-row">
                  <DateRangePicker
                    labelStart="Date accredited"
                    labelEnd="Expiration date"
                    error={errorState}
                    value={value}
                    onChange={(date) =>
                      fields.length === 0 ? appendValue(date) : updateValue(index, date)
                    }
                  />
                </div>
              </fieldset>
              <div className="flex w-full space-x-2 md:w-28">
                <ClearButton onClick={() => update(index, { ...defaultAccreditation })} />
                {fields.length > 1 && <RemoveButton onClick={() => removeValue(index)} />}
              </div>
            </div>
          );
        })}
      </div>
      <AddButton onClick={() => append({ ...defaultAccreditation })}>
        <span className="hidden md:block">Add another accreditation</span>
        <span className="md:hidden">Add accreditation</span>
      </AddButton>
    </div>
  );
}

AccreditationFieldSet.schema = () =>
  array().of(
    object().shape({
      body: string().required('This field is required'),
      accreditedAt: mixed()
        .transform((date) => new Date(date))
        .test('valid-date', 'Please enter a valid date', isValid),
      expiredAt: mixed()
        .transform((date) => new Date(date))
        .test('valid-date', 'Please enter a valid date', isValid)
        .test('future-date', 'Expiration date has passed', isFuture),
    }),
  );

AccreditationFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
