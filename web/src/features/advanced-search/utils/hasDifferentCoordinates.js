import { formatGeoCoordinates } from '@/core/components/Map';

export function hasDifferentCoordinates(centerMap, location) {
  return (
    formatGeoCoordinates(centerMap?.lat) !== formatGeoCoordinates(location?.lat) &&
    formatGeoCoordinates(centerMap?.lng) !== formatGeoCoordinates(location?.lng)
  );
}
