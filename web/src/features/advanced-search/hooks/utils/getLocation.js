import { isEmpty } from 'lodash-es';

export function getLocation({ locationCoordinates, bounds, region, needToAddBoundsInLocation }) {
  let location = {};
  const hasBounds =
    bounds &&
    bounds.northeast?.lat &&
    bounds.northeast?.lng &&
    bounds.southwest &&
    bounds.southwest?.lat &&
    bounds.southwest?.lng;

  if (hasBounds && needToAddBoundsInLocation) location.bounds = bounds;
  if (region) location.states = [region];
  if (!isEmpty(locationCoordinates)) location.coordinates = locationCoordinates;

  return location;
}
