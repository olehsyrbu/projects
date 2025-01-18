import { formatGeoCoordinates } from './formatGeoCoordinates';

it('formatGeoCoordinates should return correct value', () => {
  const result = formatGeoCoordinates(22.33333333333);
  expect(result).toBe(22.3333333);
});
