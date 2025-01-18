import PropTypes from 'prop-types';
import { mixed, object, string } from 'yup';
import { useController } from 'react-hook-form';
import isValid from 'date-fns/isValid';
import isFuture from 'date-fns/isFuture';
import { isEmpty } from 'lodash-es';
import InputText from '@/deprecated/components/FormElements/InputText/InputText';
import { DatePicker } from '@/core/components';
import { ClearButton } from './ActionButtons';

export function PsyPactFieldSet({ control, name }) {
  let {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue: { number: '', expiredAt: '', type: 'PSYPACT' },
  });

  return (
    <div className="flex flex-col items-start gap-4 md:mx-0 md:flex-row">
      <div className="flex w-full max-w-[26rem] flex-col gap-4">
        <InputText
          value={field.value.number}
          onChange={(e) => field.onChange({ ...field.value, number: e.target.value })}
          invalid={error?.number}
          errorMessage={error?.number?.message}
          label="Mobility number"
          className="md:max-w-md"
        />
        <DatePicker
          error={error?.expiredAt}
          onChange={(expiredAt) => field.onChange({ ...field.value, expiredAt })}
          value={field.value.expiredAt}
          label="EPassport Renewal Date"
          className="md:w-64"
        />
      </div>
      <ClearButton onClick={() => field.onChange({ ...field.value, number: '', expiredAt: '' })} />
    </div>
  );
}

PsyPactFieldSet.toFormValue = (licenses) => {
  const PsyPact = licenses.find(({ type }) => type === 'PSYPACT') || {
    number: '',
    expiredAt: '',
    type: 'PSYPACT',
    isSupervisorLicense: false,
  };
  return {
    isPsyPact: !isEmpty(PsyPact.number) && !isEmpty(PsyPact.expiredAt),
    PsyPact,
  };
};

PsyPactFieldSet.schema = object({
  number: string().required('This field is required'),
  expiredAt: mixed()
    .transform((date) => new Date(date))
    .test('valid-date', 'Please enter a valid date', isValid)
    .test('future-date', 'Expiration date has passed', isFuture),
});

PsyPactFieldSet.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
};
