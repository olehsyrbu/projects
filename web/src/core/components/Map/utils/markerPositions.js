export function getHintBalloonVerticalPosClass(y /*, mapHeight*/) {
  const K_MAX_BALLOON_HEIGHT = 240;
  return y > K_MAX_BALLOON_HEIGHT ? 'hint--top' : 'hint--bottom';
}

export function getHintBalloonHorizontalPosStyle(x, markerWidth, markerOffset, mapWidth) {
  const K_BALLOON_WIDTH_BASE = 390;
  // offset from map side
  const K_BALLOON_MAP_OFFSET = 10;
  // balloon with not more than map width
  const K_BALLOON_WIDTH = Math.min(K_BALLOON_WIDTH_BASE, mapWidth - 2 * K_BALLOON_MAP_OFFSET);
  // default balloon offset from arrow center i want
  const K_BALLOON_DEFAULT_OFFSET = K_BALLOON_WIDTH * 0.15;
  // from corner
  const offset = -K_BALLOON_DEFAULT_OFFSET + markerWidth * 0.5;
  // overflow in px (marker asymmetric)
  const leftX = x + offset - markerWidth * markerOffset;
  const rightX = leftX + K_BALLOON_WIDTH;
  // re-calc if overflow
  const mapOffset =
    offset +
    Math.min(0, mapWidth - K_BALLOON_MAP_OFFSET - rightX) +
    Math.max(0, K_BALLOON_MAP_OFFSET - leftX);

  return {
    width: `${K_BALLOON_WIDTH}px`,
    left: `${mapOffset}px`,
    marginLeft: '0px',
  };
}
