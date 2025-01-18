import cn from 'classnames';
import PropTypes from 'prop-types';
import { Avatar } from '@/core/components';
import { noop } from '@/core/utils';
import { getHintBalloonHorizontalPosStyle, getHintBalloonVerticalPosClass } from '../../utils';

export function AvatarMarker({
  $geoService,
  $getDimensions,
  $dimensionKey,
  size,
  origin,
  show,
  photoUrl,
  children,
  slug,
  onHoverProvider,
  hoveredProviderId,
}) {
  const mapWidth = $geoService.getWidth();
  const mapHeight = $geoService.getHeight();
  const markerDim = $getDimensions($dimensionKey);

  const hintBalloonHorizontalPosStyle = getHintBalloonHorizontalPosStyle(
    markerDim.x,
    size.width,
    origin.x,
    mapWidth,
  );
  const hintBalloonVerticalPosClass = getHintBalloonVerticalPosClass(markerDim.y, mapHeight);

  return (
    <div
      className={cn('avatarMarker', hintBalloonVerticalPosClass, {
        active: show || slug === hoveredProviderId,
      })}
      onMouseEnter={() => onHoverProvider(slug)}
      onMouseLeave={() => onHoverProvider(null)}
    >
      <Avatar url={photoUrl} className="mir-avatar" />
      {show && (
        <div style={hintBalloonHorizontalPosStyle} className="marker-info">
          {children}
        </div>
      )}
    </div>
  );
}

AvatarMarker.propTypes = {
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

AvatarMarker.defaultProps = {
  size: { width: 58, height: 58 },
  origin: { x: 15 / 58, y: 1 },
  onHoverProvider: noop,
};
