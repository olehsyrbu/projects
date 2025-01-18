import PropTypes from 'prop-types';
import { CheckboxController, ReferenceDataSelectController } from '../FilterControllers';
import './IdentityPreferencesFilter.css';

export function IdentityPreferencesProviderFilter({
  control,
  name,
  query,
  dataKey,
  onAfterChange,
}) {
  const { rainbowMember, modes, genders, ethnicities, languages, religions, sexualIdentities } =
    query;

  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  return (
    <div className="identity-preferences space-y-6">
      <ReferenceDataSelectController
        name="genders"
        type="Gender"
        label="Gender identity"
        defaultValue={genders}
        onAfterChange={handleAfterChange}
        modes={modes}
        id="gendersFilter"
      />
      <ReferenceDataSelectController
        name="sexualIdentities"
        type="SexualIdentityBased"
        label="Sexual identity"
        defaultValue={sexualIdentities}
        onAfterChange={handleAfterChange}
        modes={modes}
        id="sexualIdentitiesFilter"
      />
      <CheckboxController
        control={control}
        name="rainbowMember"
        defaultValue={rainbowMember}
        onAfterChange={handleAfterChange}
        id="rainbowMemberFilter"
      >
        LGBTQIA+ friendly
      </CheckboxController>
      <ReferenceDataSelectController
        name="religions"
        type="Religion"
        label="Religion"
        defaultValue={religions}
        onAfterChange={handleAfterChange}
        modes={modes}
        id="religionsFilter"
      />
      <ReferenceDataSelectController
        name="languages"
        type="LanguageService"
        label="Language"
        defaultValue={languages}
        onAfterChange={handleAfterChange}
        modes={modes}
        id="languagesFilter"
      />
      <ReferenceDataSelectController
        name="ethnicities"
        type="Ethnicity"
        label="Ethnicity"
        defaultValue={ethnicities}
        onAfterChange={handleAfterChange}
        modes={modes}
        id="ethnicitiesFilter"
      />
    </div>
  );
}

IdentityPreferencesProviderFilter.propTypes = {
  name: PropTypes.string,
  dataKey: PropTypes.string,
  onAfterChange: PropTypes.func,
  control: PropTypes.object.isRequired,
  query: PropTypes.shape({
    specialGroups: PropTypes.arrayOf(PropTypes.string),
    sexualIdentities: PropTypes.arrayOf(PropTypes.string),
    modes: PropTypes.arrayOf(PropTypes.string),
    genders: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.arrayOf(PropTypes.string),
    religions: PropTypes.arrayOf(PropTypes.string),
    ethnicities: PropTypes.arrayOf(PropTypes.string),
    rainbowMember: PropTypes.bool,
  }),
};

IdentityPreferencesProviderFilter.defaultProps = {
  query: {
    genders: [],
    sexualIdentities: [],
    rainbowMember: false,
    religions: [],
    languages: [],
    ethnicities: [],
  },
};
