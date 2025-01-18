import PropTypes from 'prop-types';
import { ProfileMapCard } from './ProfileMapCard';

export function SearchMapCard({ profile, onOpenProfile }) {
  return (
    <div className="map-marker-card">
      <ProfileMapCard
        profile={profile}
        onClick={() => onOpenProfile(profile.slug, profile.distance, profile.mode, profile.partner)}
      />
    </div>
  );
}

SearchMapCard.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    mode: PropTypes.string,
    distance: PropTypes.number,
    partner: PropTypes.string,
  }),
  onOpenProfile: PropTypes.func,
};
