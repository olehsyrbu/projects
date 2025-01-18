import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useTherapeuticAreas } from '@/core/api/ReferenceDataQueries';
import { ReferenceDataSelect } from '@/modules/reference-data';

export function TherapeuticAreasSelect({ value, onChange }) {
  return (
    <Suspense fallback={<ReferenceDataSelect label="Loading..." />}>
      <AreasSelect value={value} onChange={onChange} />
    </Suspense>
  );
}

TherapeuticAreasSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

function AreasSelect({ value, onChange }) {
  let therapeuticAreas = useTherapeuticAreas();
  let values = therapeuticAreas.filter((area) => value.includes(area.code));

  return (
    <ReferenceDataSelect
      isMulti
      value={values}
      className="md:max-w-md"
      options={therapeuticAreas}
      label="Select all that apply"
      id="specialties"
      onChange={(newValues) => {
        onChange(newValues.map((v) => v.code));
      }}
    />
  );
}

AreasSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
