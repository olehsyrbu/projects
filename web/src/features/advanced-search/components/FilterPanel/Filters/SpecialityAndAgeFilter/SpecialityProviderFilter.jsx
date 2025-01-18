import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import { CheckboxController, ReferenceDataSelectController } from '../FilterControllers';
import './SpecialityAndAgeFilter.css';

export function SpecialityProviderFilter({ control, dataKey, query, onAfterChange }) {
  const {
    modes,
    specialties,
    modalities,
    treatments,
    providerTypes,
    canPrescribeMedication,
    specialGroups,
    ageGroups,
  } = query;

  function handleAfterChange({ next, name, prev }) {
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

SpecialityProviderFilter.propTypes = {
  name: PropTypes.string,
  dataKey: PropTypes.string,
  control: PropTypes.object.isRequired,
  onAfterChange: PropTypes.func,
  query: PropTypes.shape({
    modalities: PropTypes.arrayOf(PropTypes.string),
    treatments: PropTypes.arrayOf(PropTypes.string),
    providerTypes: PropTypes.arrayOf(PropTypes.string),
    canPrescribeMedication: PropTypes.bool,
    specialties: PropTypes.array,
    modes: PropTypes.array,
    ageGroups: PropTypes.array,
    specialGroups: PropTypes.arrayOf(PropTypes.string),
  }),
};

SpecialityProviderFilter.defaultProps = {
  onAfterChange: noop,
  query: {
    modalities: [],
    treatments: [],
    providerTypes: [],
    canPrescribeMedication: false,
    specialties: [],
    ageGroups: [],
    specialGroups: [],
  },
};
