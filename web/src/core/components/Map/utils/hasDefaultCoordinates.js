import { provideDefaultCoordinates } from '../utils';

export function hasDefaultCoordinates(coordinates = { lat: 0, lng: 0 }) {
  const { lat, lng } = provideDefaultCoordinates();
  return lat === coordinates.lat && lng === coordinates.lng;
}
