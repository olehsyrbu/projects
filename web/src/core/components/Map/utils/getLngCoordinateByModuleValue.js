export function getLngCoordinateByModuleValue(lng) {
  const sideLngModule = (lng + 180) % 360;
  if (lng > 180) {
    lng = sideLngModule - 180;
  }
  if (lng < -180) {
    lng = sideLngModule + 180;
  }
  return lng;
}
