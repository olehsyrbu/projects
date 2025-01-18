import { hasLocationChangesWithinMap } from '../utils';

it('hasLocationChangesWithinMap has different state', () => {
  const result = hasLocationChangesWithinMap(
    {
      zoom: 3,
      location: {
        lat: 27.09024,
        lng: -25.712891,
      },
    },
    5,
    true,
  );
  expect(result).toBe(true);
});

it('hasLocationChangesWithinMap has different zoom', () => {
  const result = hasLocationChangesWithinMap({ zoom: 3, locationInput: 'some' }, 1);
  expect(result).toBe(true);
});

it('hasLocationChangesWithinMap has isDifferentCoordinates', () => {
  const result = hasLocationChangesWithinMap({ zoom: 3, locationInput: 'some' }, 1, true);
  expect(result).toBe(true);
});

it('hasLocationChangesWithinMap should return false', () => {
  const result = hasLocationChangesWithinMap();
  expect(result).toBe(false);
});
