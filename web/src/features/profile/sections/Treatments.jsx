/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import { List } from '../components';

export function Treatments({ profile, anchorId }) {
  let providerTypes = [];
  let supportGroups = [];

  if (profile.mode === 'PROGRAM') {
    providerTypes = profile.providerTypes?.map((t) => t.providerType);

    if (profile.treatsMedicallyUnstable) {
      supportGroups.push({ id: 'MU', name: 'Medically unstable' });
    }
    if (profile.treatsSuicidalIdeation) {
      supportGroups.push({ id: 'AS', name: 'Actively suicidal' });
    }
    if (profile.canAssistWithDailyLiving) {
      supportGroups.push({ id: 'DA', name: 'Help with daily activities' });
    }
  }

  if (
    !profile.therapyTypes?.length &&
    !profile.services?.length &&
    !providerTypes?.length &&
    !profile.treatmentTypes?.length &&
    !supportGroups?.length
  ) {
    return null;
  }

  return (
    <section className="pb-6 max-md:px-4">
      <h2 className="-mt-6 mb-4 pt-12 text-2xl font-bold" id={anchorId}>
        {profile.mode === 'PROGRAM' ? 'Treatments available' : 'Treatment specialties'}
      </h2>

      <div className="grid gap-x-9 gap-y-4 md:grid-cols-[280px_1fr]">
        {profile.therapyTypes?.length ? (
          <div>
            <h3 className="mb-3 font-bold">Therapeutic modalities</h3>
            <List items={profile.therapyTypes} />
          </div>
        ) : null}

        {profile.services?.length ? (
          <div>
            <h3 className="mb-3 font-bold">Services</h3>
            <List items={profile.services} />
          </div>
        ) : null}

        {providerTypes?.length ? (
          <div>
            <h3 className="mb-3 font-bold">Providers on staff</h3>
            <List items={providerTypes} />
          </div>
        ) : null}

        {profile.treatmentTypes?.length ? (
          <div>
            <h3 className="mb-3 font-bold">Treatments</h3>
            <List items={profile.treatmentTypes} />
          </div>
        ) : null}

        {supportGroups?.length ? (
          <div>
            <h3 className="mb-3 font-bold">Support for</h3>
            <List items={supportGroups} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

Treatments.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
