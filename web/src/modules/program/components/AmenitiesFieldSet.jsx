import PropTypes from 'prop-types';
import cn from 'classnames';
import { groupBy, omit, pick } from 'lodash-es';
import { useController } from 'react-hook-form';
import { useAmenities } from '@/core/api/ReferenceDataQueries';
import { Checkbox, ChipRadio } from '@/modules/form';

const preselectedAmenities = {
  Facilities: [],
  'Cell phone use': 'ACPUPI',
  Exercise: 'AEPI',
  'Laptop / Tablet use': 'ALTUPI',
  Smoking: 'ASHWSCPPI',
  Vaping: 'AVHWVCPPI',
};

export function AmenitiesFieldSet({ name, control, columns }) {
  let amenitiesReferenceData = useAmenities('PROGRAM');

  //TODO MIR-3285, defaultValue should be moved to BE part
  const { fieldState } = useController({
    control,
    name,
    defaultValue: preselectedAmenities,
  });
  let amenitiesGroup = groupBy(amenitiesReferenceData, 'category');
  const others = Object.entries(omit(amenitiesGroup, 'Facilities'));
  const [[facilityTypeLabel, facilityTypes]] = Object.entries(pick(amenitiesGroup, 'Facilities'));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p>
          <span className="font-bold">{facilityTypeLabel}</span> (optional)
        </p>
        <div
          className={cn('columns-auto gap-x-10', {
            'md:columns-2': columns === 2,
            'md:columns-3': columns === 3,
          })}
        >
          <div className="-mb-3 [column-span:all]" />
          {facilityTypes.map(({ code, name: label, category }) => (
            <div key={code} className="my-3">
              <Checkbox name={`${name}.${category}`} value={code} control={control}>
                <span className="text-sm">{label}</span>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
      {others.map(([category, options]) => (
        <div key={category} className="space-y-3">
          <p className="font-bold">{category}</p>
          <div className="flex flex-wrap gap-2 md:gap-x-4">
            {options.map(({ code, name: label }) => (
              <ChipRadio
                key={code}
                label={label}
                name={`${name}.${category}`}
                value={code}
                control={control}
              />
            ))}
          </div>
          {fieldState.error && fieldState.error[category] && (
            <p className="text-xs font-light text-error-1">{fieldState.error[category].message}</p>
          )}
        </div>
      ))}
    </div>
  );
}

AmenitiesFieldSet.toValueApi = (amenities) => {
  return Object.entries(amenities).map(([category, value]) => ({
    category,
    items: [].concat(value),
  }));
};

AmenitiesFieldSet.toFormValue = (amenities) => {
  function groupAmenities(amenities) {
    let groups = Object.fromEntries(amenities.map((a) => [a.category, a.code]));
    groups['Facilities'] = amenities.filter((a) => a.category === 'Facilities').map((a) => a.code);
    return groups;
  }

  return {
    ...preselectedAmenities,
    ...groupAmenities(amenities),
  };
};

AmenitiesFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  className: PropTypes.string,
  columns: PropTypes.oneOf([2, 3]),
};

AmenitiesFieldSet.defaultProps = {
  columns: 2,
};
