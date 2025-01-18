import PropTypes from 'prop-types';
import { useDietaryAccommodationType } from '@/core/api/ReferenceDataQueries';
import { ChipRadio } from '@/modules/form';

export function DietaryAccommodationFieldSet({ name, control }) {
  let dietaryAccommodationType = useDietaryAccommodationType('PROGRAM');
  let sorted = dietaryAccommodationType.slice().sort((t1, t2) => t1.order - t2.order);

  return (
    <div className="flex flex-wrap gap-4">
      {sorted.map(({ code, name: label }) => (
        <ChipRadio key={code} label={label} name={name} value={code} control={control} />
      ))}
    </div>
  );
}

DietaryAccommodationFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
