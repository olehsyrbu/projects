import PropType from 'prop-types';
import PropTypes from 'prop-types';
import './SpecialityAndAgeFilter.css';
import { noop } from '@/core/utils';
import { MedicalFilter } from '../MedicalFilter';
import { CheckboxController, ReferenceDataSelectController } from '../FilterControllers';

export function SpecialityFilter({ control, dataKey, query, onAfterChange }) {
  const {
    modes,
    specialties,
    modalities,
    treatments,
    providerTypes,
    canPrescribeMedication,
    programTypes,
    treatsMedicallyUnstable,
    treatsSuicidalIdeation,
    canAssistWithDailyLiving,
    specialGroups,
    ageGroups,
  } = query;

  function handleAfterChange({ next, prev, name }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  return (
    <div className="space-y-6">
      <ReferenceDataSelectController
        name="specialties"
        type="TherapeuticArea"
        label="Areas of focus"
        defaultValue={specialties}
        infoMessage="Anxiety, Depression, Self-Esteem, etc."
        onAfterChange={handleAfterChange}
        modes={modes}
        id="specialtiesFilter"
      />
      <ReferenceDataSelectController
        name="modalities"
        type="Therapy"
        label="Modalities"
        defaultValue={modalities}
        infoMessage="Talk Therapy, Couples Therapy, Family Therapy, etc."
        onAfterChange={handleAfterChange}
        modes={modes}
        id="modalitiesFilter"
      />
      <ReferenceDataSelectController
        name="treatments"
        type="Treatment"
        label="Treatments"
        defaultValue={treatments}
        infoMessage="EMDR, TMS, Hypnosis, etc."
        onAfterChange={handleAfterChange}
        modes={modes}
        id="treatmentsFilter"
      />
      <ReferenceDataSelectController
        name="providerTypes"
        type="ProviderType"
        modes={modes}
        label="Provider type"
        defaultValue={providerTypes}
        infoMessage="Psychologist, Psychiatrist, LMFT, etc."
        onAfterChange={handleAfterChange}
        id="providerTypesFilter"
      />
      <CheckboxController
        control={control}
        className="mb-4"
        name="canPrescribeMedication"
        defaultValue={canPrescribeMedication}
        onAfterChange={handleAfterChange}
        id="canPrescribeMedicationFilter"
      >
        Offers medication management
      </CheckboxController>
      <ReferenceDataSelectController
        name="programTypes"
        type="ProgramType"
        label="Program type"
        defaultValue={programTypes}
        onAfterChange={handleAfterChange}
        modes="PROGRAM"
        id="programTypesFilter"
      />
      <MedicalFilter
        dataKey={dataKey}
        control={control}
        onAfterChange={onAfterChange}
        treatsMedicallyUnstable={treatsMedicallyUnstable}
        treatsSuicidalIdeation={treatsSuicidalIdeation}
        canAssistWithDailyLiving={canAssistWithDailyLiving}
      />
      <ReferenceDataSelectController
        name="specialGroups"
        type="SpecialGroup"
        label="Special groups"
        defaultValue={specialGroups}
        onAfterChange={handleAfterChange}
        modes={modes}
        infoMessage="Body positivity, People with disabilities, Active duty military, etc."
        id="specialGroupsFilter"
      />
      <ReferenceDataSelectController
        name="ageGroups"
        type="AgeGroup"
        label="Age groups"
        defaultValue={ageGroups}
        onAfterChange={handleAfterChange}
        modes={modes}
        sorted={false}
        id="ageGroupsFilter"
        sort={{ order: 'ASC' }}
      />
    </div>
  );
}

SpecialityFilter.propTypes = {
  name: PropTypes.string,
  dataKey: PropTypes.string,
  control: PropType.object.isRequired,
  onAfterChange: PropTypes.func,
  query: PropType.shape({
    programTypes: PropTypes.arrayOf(PropTypes.string),
    modalities: PropTypes.arrayOf(PropTypes.string),
    treatments: PropTypes.arrayOf(PropTypes.string),
    providerTypes: PropTypes.arrayOf(PropTypes.string),
    canPrescribeMedication: PropTypes.bool,
    specialties: PropType.array,
    modes: PropType.array,
    ageGroups: PropType.array,
    specialGroups: PropTypes.arrayOf(PropTypes.string),
    treatsMedicallyUnstable: PropType.bool,
    treatsSuicidalIdeation: PropType.bool,
    canAssistWithDailyLiving: PropType.bool,
  }),
};

SpecialityFilter.defaultProps = {
  onAfterChange: noop,
  query: {
    treatsMedicallyUnstable: false,
    treatsSuicidalIdeation: false,
    canAssistWithDailyLiving: false,
    programTypes: [],
    modalities: [],
    treatments: [],
    providerTypes: [],
    canPrescribeMedication: false,
    specialties: [],
    ageGroups: [],
    specialGroups: [],
  },
};
