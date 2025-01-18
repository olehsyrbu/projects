import PropTypes from 'prop-types';
import { useFieldArray } from 'react-hook-form';

import { useStates } from '@/core/api/StatesQueries';
import { DatePicker, ReferenceDataSelect, TextField } from '@/modules/form';
import { array, lazy, mixed, object, string } from 'yup';
import { AddButton, ClearButton, RemoveButton } from '../ActionButtons';
import isValid from 'date-fns/isValid';
import isFuture from 'date-fns/isFuture';
import { isString } from 'lodash-es';
import format from 'date-fns/format';

export function LicenseFieldSet({ name, control, isStateDisabled, hideAddMoreLicense }) {
  const states = useStates();
  const { fields, append, remove, update } = useFieldArray({ control, name });
  const defaultLicense = {
    organization: '',
    name: '',
    number: '',
    state: isStateDisabled ? fields[0]?.state : null,
    expiredAt: '',
  };

  return (
    <div className="space-y-6">
      <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="-mx-4 flex flex-col items-start gap-4 px-4 py-6 first:pt-0 last:pb-0 md:mx-0 md:flex-row md:px-0"
          >
            <fieldset className="flex w-full max-w-[26rem] flex-col gap-4">
              <TextField
                label="Licensing body (optional)"
                name={`${name}.${index}.organization`}
                control={control}
              />
              <TextField
                label="Type"
                name={`${name}.${index}.name`}
                aria-label={`${name}.${index}.name`}
                control={control}
              />
              <TextField label="Number" name={`${name}.${index}.number`} control={control} />
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <ReferenceDataSelect
                  className="md:basis-60"
                  options={states}
                  control={control}
                  name={`${name}.${index}.state`}
                  label="State"
                  disabled={isStateDisabled && fields.length === 1 && index === 0}
                />
                <DatePicker
                  label="Expiration Date"
                  name={`${name}.${index}.expiredAt`}
                  control={control}
                />
              </div>
            </fieldset>
            <div className="flex w-full space-x-2 md:w-28">
              <ClearButton onClick={() => update(index, { ...defaultLicense })} />
              {fields.length > 1 && <RemoveButton onClick={() => remove(index)} />}
            </div>
          </div>
        ))}
      </div>
      {!hideAddMoreLicense && (
        <AddButton onClick={() => append({ ...defaultLicense })}>
          <span className="hidden md:block">Add another license</span>
          <span className="md:hidden">Add license</span>
        </AddButton>
      )}
    </div>
  );
}

LicenseFieldSet.toValueApi = (licenses) => {
  return licenses
    .filter(({ number, expiredAt }) => number && expiredAt)
    .map(({ id, state, expiredAt, ...rest }) => ({
      ...rest,
      expiredAt: isString(expiredAt) ? expiredAt : format(expiredAt, 'MM/dd/yyyy'),
      ...(state?.id && { stateId: state?.id }),
    }));
};

LicenseFieldSet.schema = () =>
  lazy((licenses) => {
    const schema = array();

    if (licenses.length) {
      return schema.of(
        object({
          organization: string().nullable(),
          name: string().required('This field is required'),
          number: string().required('This field is required'),
          state: object().nullable().required('This field is required'),
          expiredAt: mixed()
            .transform((date) => new Date(date))
            .test('valid-date', 'Please enter a valid date', isValid)
            .test('future-date', 'Expiration date has passed', isFuture),
        }),
      );
    }

    const msg = 'This field is required';
    return schema.of(
      object().shape(
        {
          state: object()
            .nullable()
            .when(['name', 'number', 'organization', 'expiredAt'], {
              is: (name, number, organization, expiredAt) =>
                name || number || organization || expiredAt,
              then: (schema) => schema.required(msg),
            }),
          name: string().when(['organization', 'number', 'expiredAt'], {
            is: (organization, number, expiredAt) => organization || number || expiredAt,
            then: (schema) => schema.required(msg),
          }),
          number: string().when(['organization', 'name', 'expiredAt'], {
            is: (organization, name, expiredAt) => organization || name || expiredAt,
            then: (schema) => schema.required(msg),
          }),
          expiredAt: mixed()
            .transform((date) => (date === '' ? '' : new Date(date)))
            .test('valid-date', 'Please enter a valid date', (date, { parent }) => {
              let { name, number, organization } = parent;
              const hasOtherValues =
                name.length > 0 || number.length > 0 || organization.length > 0;
              return !!((date === '' && !hasOtherValues) || (isFuture(date) && isValid(date)));
            }),
        },
        [
          ['name', 'number', 'organization', 'expiredAt'],
          ['organization', 'number', 'expiredAt'],
          ['organization', 'name', 'expiredAt'],
        ],
      ),
    );
  });

LicenseFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  isStateDisabled: PropTypes.bool,
  hideAddMoreLicense: PropTypes.bool,
};

LicenseFieldSet.defaultProps = {
  hideAddMoreLicense: false,
};
