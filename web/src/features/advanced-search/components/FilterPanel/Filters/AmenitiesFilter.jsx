import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { groupBy, camelCase } from 'lodash-es';
import PropTypes from 'prop-types';
import { useAmenities } from '@/core/api/ReferenceDataQueries';
import { Checkbox } from '@/core/components/Checkbox';
import { ReferenceDataSelect } from '@/modules/reference-data';

export function AmenitiesFilter({ control, query, dataKey, onAfterChange, otherGroup }) {
  const { amenities = [], dietaryAccommodations = [] } = query;

  const amenitiesRefData = useAmenities('PROGRAM');
  const { facilitiesOptions, othersOptions } = groupBy(amenitiesRefData, ({ category }) =>
    category === 'Facilities' ? 'facilitiesOptions' : 'othersOptions',
  );

  function filterByQueryAmenities(items) {
    return items.filter(({ code }) => amenities?.includes(code));
  }

  const [facilityAmenities, setFacilities] = useState(filterByQueryAmenities(facilitiesOptions));
  const [othersAmenities, setOthersAmenities] = useState(filterByQueryAmenities(othersOptions));

  const { field } = useController({
    name: 'amenities',
    control,
    defaultValue: [
      ...facilityAmenities.map(({ code }) => code),
      ...othersAmenities.map(({ code }) => code),
    ],
  });

  useEffect(() => {
    if (amenities.length === 0) {
      field.onChange([]);
    }
  }, [amenities]);

  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  function onChangeFacilities(values) {
    let next = values.map(({ code }) => code);
    const otherFields = field.value.filter(
      (code) => !facilityAmenities.map(({ code }) => code)?.includes(code),
    );
    field.onChange([...new Set([...otherFields, ...next])]);
    handleAfterChange({ name: field.name, next, prev: field.value });
    setFacilities(values);
  }

  function onChangeOtherAmenities(checked, optionCodes) {
    let value = Array.isArray(field.value) ? field.value : [];
    value = checked
      ? [...new Set([...optionCodes, ...value])]
      : value.filter((v) => !optionCodes?.includes(v));

    field.onChange(value);
    handleAfterChange({ name: field.name, next: value, prev: field.value });
    setOthersAmenities(value);
  }

  return (
    <>
      <ReferenceDataSelect
        isMulti
        label="Facilities"
        value={facilityAmenities}
        options={facilitiesOptions}
        onChange={onChangeFacilities}
        className="mb-4"
        id="facilitiesFilter"
      />

      <div className="flex flex-col">
        {Object.entries(otherGroup).map(([category, optionCodes]) => (
          <Checkbox
            className="checkbox mb-4"
            isSelected={field.value?.includes(...optionCodes)}
            onChange={(isSelected) => onChangeOtherAmenities(isSelected, optionCodes)}
            id={`${camelCase(category)}Filter`}
          >
            {category}
          </Checkbox>
        ))}
      </div>

      <DietaryCheckboxController
        name="dietaryAccommodations"
        control={control}
        defaultValue={dietaryAccommodations}
        onAfterChange={handleAfterChange}
        id="dietaryAccommodationsFilter"
      />
    </>
  );
}

AmenitiesFilter.defaultProps = {
  query: {
    amenities: [],
    dietaryAccommodations: [],
  },
  otherGroup: {
    'Cell phone use allowed': ['ACPUP', 'ACPUSTFUDTD', 'ACPUPI'],
    'Laptop/tablet use allowed': ['ALTUP', 'ALTUSTFUDTD', 'ALTUPI'],
    'Smoking allowed': ['ASP', 'ASHWSCPPI'],
    'Vaping allowed': ['AVP', 'AVHWVCPPI'],
    'Exercise allowed': ['AEP', 'AEPI'],
  },
  facilitiesCodes: [
    'AFTCSR',
    'AFFPRWESB',
    'AFFSPRWSB',
    'AFFPRWSB',
    'AFPAR',
    'AFCGS',
    'AFA',
    'AFCATC',
    'AFOT',
    'AFPT',
    'AFFC',
    'AFSF',
    'AFG',
    'AFCWRS',
    'AFGOG',
    'AFOR',
    'AFP',
    'AFMS',
    'AFNDOS',
    'AFGNB',
    'AFFSPRWESB',
  ],
};

AmenitiesFilter.getFilterCount = ({ amenities = [], dietaryAccommodations = [] }) => {
  const { facilitiesCodes, otherGroup } = AmenitiesFilter.defaultProps;
  const defaultOptionCodes = [
    DietaryCheckboxController.defaultProps.codes,
    ...Object.values(otherGroup),
  ];
  const queryCodes = [...amenities, ...dietaryAccommodations];
  const facilityCount = facilitiesCodes.filter((code) => amenities?.includes(code))?.length;

  return (
    defaultOptionCodes.reduce((memo, options) => {
      if (queryCodes.includes(...options)) {
        memo += 1;
      }
      return memo;
    }, facilityCount) || null
  );
};

AmenitiesFilter.propTypes = {
  otherGroup: PropTypes.object,
  name: PropTypes.string,
  control: PropTypes.object.isRequired,
  onAfterChange: PropTypes.func,
  defaultValue: PropTypes.string,
  children: PropTypes.node,
  query: PropTypes.object,
  dataKey: PropTypes.string,
};

function DietaryCheckboxController({ name, control, defaultValue, onAfterChange, codes, id }) {
  const { field } = useController({ name, control, defaultValue });
  useEffect(() => {
    if (defaultValue !== field.value) {
      field.onChange(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Checkbox
      className="checkbox"
      isSelected={codes.includes(...field.value)}
      onChange={(isSelected) => {
        const values = isSelected ? field.value.concat(codes) : [];
        field.onChange(values);
        onAfterChange({ next: values, prev: field.value, name });
      }}
      id={id}
    >
      Dietary accommodations accepted
    </Checkbox>
  );
}

DietaryCheckboxController.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.array,
  onAfterChange: PropTypes.func,
  codes: PropTypes.array,
  id: PropTypes.string,
};

DietaryCheckboxController.defaultProps = {
  codes: ['DAWA', 'DAWAWD', 'DAWAAA', 'DAPA'],
};
