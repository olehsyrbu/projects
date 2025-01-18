import PropTypes from 'prop-types';
import { ReferenceDataSelectController } from '../FilterControllers';
import './IdentityPreferencesFilter.css';

export function IdentityPreferencesFilter({ query, dataKey, onAfterChange }) {
  const { modes, genders, ethnicities, languages, religions, sexualIdentities } = query;

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

IdentityPreferencesFilter.propTypes = {
  dataKey: PropTypes.string,
  name: PropTypes.string,
  onAfterChange: PropTypes.func,
  query: PropTypes.shape({
    sexualIdentities: PropTypes.arrayOf(PropTypes.string),
    modes: PropTypes.arrayOf(PropTypes.string),
    genders: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.arrayOf(PropTypes.string),
    religions: PropTypes.arrayOf(PropTypes.string),
    ethnicities: PropTypes.arrayOf(PropTypes.string),
  }),
};

IdentityPreferencesFilter.defaultProps = {
  query: {
    genders: [],
    sexualIdentities: [],
    religions: [],
    languages: [],
    ethnicities: [],
  },
};
