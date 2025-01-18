import { useController, useWatch } from 'react-hook-form';
import { array, object, string } from 'yup';
import PropTypes from 'prop-types';
import { ChipRadio } from '@/modules/form';
import { AdmissionDateRangePicker } from './AdmissionDateRangePicker';
import { AdmissionDays } from './AdmissionDays';

let types = [
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'WEEKDAYS', label: 'Specific days of week' },
  { value: 'DATES', label: 'Select dates' },
];

export function AdmissionScheduleFieldSet({ name, control }) {
  const type = useWatch({ name: `${name}.type`, control });
  const {
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {types.map(({ value, label }) => (
          <ChipRadio
            key={value}
            label={label}
            name={`${name}.type`}
            value={value}
            control={control}
          />
        ))}
      </div>
      {error?.type && <p className="text-xs font-light text-error-1">{error.type.message}</p>}
      {type === 'WEEKDAYS' && <AdmissionDays name={`${name}.weekdays`} control={control} />}
      {type === 'DATES' && <AdmissionDateRangePicker name={`${name}.dates`} control={control} />}
    </div>
  );
}

AdmissionScheduleFieldSet.toFormValue = (admission) => ({
  type: admission?.type ?? null,
  weekdays: admission?.weekdays ?? [],
  dates: admission?.dates.length > 0 ? admission.dates : [{}],
});

AdmissionScheduleFieldSet.toValueApi = (admission) => ({
  type: admission?.type ?? null,
  weekdays: admission?.type === 'WEEKDAYS' && admission?.weekdays ? admission?.weekdays : [],
  dates:
    admission?.type === 'DATES' && admission?.dates.length > 0
      ? admission.dates.filter((d) => d.start && d.end)
      : [],
});

AdmissionScheduleFieldSet.schema = object({
  type: string().nullable().required('This field is required'),
  weekdays: array().when('type', {
    is: 'WEEKDAYS',
    then: (s) => s.min(1, 'Select at least one option'),
  }),
  dates: array().when('type', {
    is: 'DATES',
    then: () =>
      array(
        object({
          start: string().required('This field is required'),
          end: string().required('This field is required'),
        }),
      ).min(1, 'Add at least one date range'),
  }),
});

AdmissionScheduleFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
