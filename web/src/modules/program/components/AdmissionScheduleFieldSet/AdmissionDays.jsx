import PropTypes from 'prop-types';
import { Checkbox } from '@/modules/form';
import { useController } from 'react-hook-form';

let weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export function AdmissionDays({ name, control }) {
  const {
    fieldState: { error },
  } = useController({ name, control });
  return (
    <>
      <div className="flex flex-wrap gap-x-6 gap-y-8">
        {weekdays.map((day) => (
          <Checkbox key={day} name={name} value={day} control={control}>
            <span className="capitalize">{day.slice(0, 3).toLowerCase()}</span>
          </Checkbox>
        ))}
      </div>
      {error && <p className="text-xs font-light text-error-1">{error.message}</p>}
    </>
  );
}

AdmissionDays.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
