import { CITY_ZOOM } from '../utils';

export function hasLocationChangesWithinMap(geocodings = null, zoomMap, isDifferentCoordinates) {
  if (geocodings) {
    const isDifferentZoom =
      geocodings.zoom &&
      geocodings.zoom !== zoomMap &&
      CITY_ZOOM !== zoomMap &&
      geocodings.locationInput;

    if ((geocodings.location && isDifferentCoordinates) || isDifferentZoom) {
      return true;
    }
  }
  return false;
}
