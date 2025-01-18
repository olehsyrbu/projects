import { string } from 'yup';
import PropTypes from 'prop-types';
import { ChipRadio } from '@/modules/form';

let statusList = [
  { value: 'ACCEPTING_NEW_CLIENTS', name: 'Accepting clients' },
  { value: 'NOT_ACCEPTING_NEW_CLIENTS', name: 'Not accepting clients' },
  { value: 'PLEASE_INQUIRE', name: 'Please inquire' },
];

export function AvailabilityStatusFieldSet({ name, control }) {
  return (
    <div className="flex flex-wrap gap-4">
      {statusList.map(({ name: label, value }) => (
        <ChipRadio key={value} label={label} name={name} value={value} control={control} />
      ))}
    </div>
  );
}

AvailabilityStatusFieldSet.toFormValue = (availability) => ({
  availability: {
    status: availability?.status ?? 'ACCEPTING_NEW_CLIENTS',
    is247: availability?.is247 ?? false,
    hours: availability?.hours ?? [],
  },
});

AvailabilityStatusFieldSet.toValueApi = (availability) => ({
  availability: {
    ...availability,
    hours: availability.hours.filter((h) => h.start && h.end),
  },
});

AvailabilityStatusFieldSet.schema = string().oneOf(statusList.map((s) => s.value));

AvailabilityStatusFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
