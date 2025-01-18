import PropTypes from 'prop-types';
import { TooltipIcon } from '@/core/components/Tooltip';
import { MedicalFilter } from './MedicalFilter';
import { ReferenceDataSelectController } from './FilterControllers';

export function EligibilityFilter({ query, dataKey, onAfterChange, ...props }) {
  const {
    specialties,
    ageGroups,
    treatsMedicallyUnstable,
    treatsSuicidalIdeation,
    canAssistWithDailyLiving,
    genders,
    sexualIdentities,
    religions,
    ethnicities,
    specialGroups,
  } = query;

  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <ReferenceDataSelectController
          className="flex-1"
          label="Mental health conditions"
          name="specialties"
          type="TherapeuticArea"
          defaultValue={specialties}
          modes="PROGRAM"
          onAfterChange={handleAfterChange}
          id="specialtiesEligibilityFilter"
          {...props}
        />
        <TooltipIcon label="If you have been diagnosed with a mental health condition, you can enter it here. We will show you programs that treat that condition and/or require that condition to be eligible. We will not show you programs that specifically indicate they do not treat that condition" />
      </div>

      <ReferenceDataSelectController
        label="Age groups"
        name="ageGroups"
        type="AgeGroup"
        defaultValue={ageGroups}
        sorted={false}
        modes="PROGRAM"
        onAfterChange={handleAfterChange}
        id="ageGroupsEligibilityFilter"
        sort={{ order: 'ASC' }}
        {...props}
      />

      <MedicalFilter
        treatsMedicallyUnstable={treatsMedicallyUnstable}
        treatsSuicidalIdeation={treatsSuicidalIdeation}
        canAssistWithDailyLiving={canAssistWithDailyLiving}
        dataKey={dataKey}
        onAfterChange={onAfterChange}
        {...props}
      />

      <div className="flex items-center space-x-2 font-bold">
        <span>Other characteristics</span>
        <TooltipIcon label="Some groups have certain member characteristics, because they cater to specific populations. Feel free to filter by the following so we can match you accordingly." />
      </div>

      <ReferenceDataSelectController
        label="Gender identity"
        name="genders"
        type="Gender"
        defaultValue={genders}
        modes="PROGRAM"
        onAfterChange={handleAfterChange}
        id="gendersEligibilityFilter"
        {...props}
      />

      <ReferenceDataSelectController
        label="Sexual identity"
        name="sexualIdentities"
        type="SexualIdentityBased"
        defaultValue={sexualIdentities}
        modes="PROGRAM"
        onAfterChange={handleAfterChange}
        id="sexualIdentitiesEligibilityFilter"
        {...props}
      />

      <ReferenceDataSelectController
        label="Religion"
        name="religions"
        type="Religion"
        defaultValue={religions}
        modes="PROGRAM"
        onAfterChange={handleAfterChange}
        id="religionsEligibilityFilter"
        {...props}
      />

      <ReferenceDataSelectController
        label="Ethnicity"
        name="ethnicities"
        type="Ethnicity"
        defaultValue={ethnicities}
        modes="PROGRAM"
        onAfterChange={handleAfterChange}
        id="ethnicitiesEligibilityFilter"
        {...props}
      />

      <ReferenceDataSelectController
        label="Special groups"
        name="specialGroups"
        type="SpecialGroup"
        defaultValue={specialGroups}
        infoMessage="Body positivity, People with disabilities, Active duty military, etc."
        modes="PROGRAM"
        onAfterChange={handleAfterChange}
        id="specialGroupsEligibilityFilter"
        {...props}
      />
    </div>
  );
}

EligibilityFilter.propTypes = {
  dataKey: PropTypes.string,
  onAfterChange: PropTypes.func,
  control: PropTypes.object,
  query: {
    ageGroups: PropTypes.array,
    treatsMedicallyUnstable: PropTypes.bool,
    treatsSuicidalIdeation: PropTypes.bool,
    canAssistWithDailyLiving: PropTypes.bool,
    specialties: PropTypes.array,
    genders: PropTypes.array,
    sexualIdentities: PropTypes.array,
    religions: PropTypes.array,
    ethnicities: PropTypes.array,
    specialGroups: PropTypes.array,
  },
};

EligibilityFilter.defaultProps = {
  query: {
    treatsMedicallyUnstable: false,
    treatsSuicidalIdeation: false,
    canAssistWithDailyLiving: false,
    ageGroups: [],
    specialties: [],
    specialGroups: [],
    ethnicities: [],
    religions: [],
    sexualIdentities: [],
    genders: [],
  },
};
