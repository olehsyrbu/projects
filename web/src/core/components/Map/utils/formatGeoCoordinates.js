export function formatGeoCoordinates(value) {
  if (value && value.toFixed) {
    return +value.toFixed(7);
  }
  return null;
}
