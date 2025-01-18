/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import { getEventProperties } from '../getEventProperties';

export function Other({ profile, anchorId }) {
  if (!profile.website) {
    return null;
  }

  return (
    <section className="space-y-4 pb-6 max-md:px-4">
      <h2 className="-mt-6 pt-12 text-2xl font-bold text-regular" id={anchorId}>
        Other
      </h2>

      <a
        href={profile.website}
        target="_blank"
        rel="noreferrer"
        className="block font-medium text-p-100"
        onClick={() => trackWebsiteOpen(profile)}
      >
        Visit website
      </a>
    </section>
  );
}

function trackWebsiteOpen(profile) {
  let properties = getEventProperties(profile);

  mixpanel.track('Schedule Website Clicked', properties);
}

Other.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
