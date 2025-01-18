import PropTypes from 'prop-types';
import { AvatarMarker } from './AvatarMarker';
import './Marker.css';

export function Marker({
  cluster,
  children,
  $geoService,
  $dimensionKey,
  $getDimensions,
  show,
  photoUrl,
  slug,
  onHoverProvider,
  hoveredProviderId,
}) {
  return (
    <>
      {cluster?.length > 0 ? (
        <div className="clusterMarker">{cluster?.length}</div>
      ) : (
        <AvatarMarker
          $geoService={$geoService}
          $dimensionKey={$dimensionKey}
          $getDimensions={$getDimensions}
          show={show}
          photoUrl={photoUrl}
          slug={slug}
          onHoverProvider={onHoverProvider}
          hoveredProviderId={hoveredProviderId}
        >
          {children}
        </AvatarMarker>
      )}
    </>
  );
}

Marker.propTypes = {
  cluster: PropTypes.array,
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $dimensionKey: PropTypes.string,
  size: PropTypes.object,
  origin: PropTypes.object,
  show: PropTypes.bool,
  photoUrl: PropTypes.string,
  children: PropTypes.node,
  slug: PropTypes.string,
  onHoverProvider: PropTypes.func,
  hoveredProviderId: PropTypes.string,
};
