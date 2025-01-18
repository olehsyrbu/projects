/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import { List, ChipList } from '../components/List';

export function AreasOfFocus({ profile, anchorId }) {
  return (
    <section className="space-y-4 pb-6 max-md:px-4">
      <h2 className="-mt-6 pt-12 text-2xl font-bold" id={anchorId}>
        Areas of focus
      </h2>

      {profile.therapeuticAreas?.length > 0 ? (
        <div>
          <h3 className="mb-3 font-bold">Areas of expertise</h3>
          <ChipList items={profile.therapeuticAreas.map((area) => area.therapeuticArea)} />
        </div>
      ) : null}

      <div className="max-md:space-y-4 md:grid md:grid-cols-2 md:gap-x-4">
        {profile.ageGroups?.length > 0 ? (
          <div>
            <h3 className="mb-3 font-bold">Age groups</h3>
            <List items={profile.ageGroups} />
          </div>
        ) : null}

        {profile.specialGroups?.length > 0 ? (
          <div>
            <h3 className="mb-3 font-bold">Special groups</h3>
            <List items={profile.specialGroups} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

AreasOfFocus.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
