import { getLocation } from './getLocation';

it('getLocation bounds', () => {
  const bounds = {
    northeast: { lat: 52.429222428484195, lng: -64.55566443750001 },
    southwest: { lat: 21.207458960637325, lng: -127.57324256250001 },
  };
  expect(getLocation({ bounds, needToAddBoundsInLocation: true })).toEqual({
    bounds,
  });
});

it('getLocation bounds and region', () => {
  const query = {
    needToAddBoundsInLocation: true,
    bounds: {
      northeast: { lat: 52.429222428484195, lng: -64.55566443750001 },
      southwest: { lat: 21.207458960637325, lng: -127.57324256250001 },
    },
    region: 'ID',
  };

  expect(getLocation(query)).toEqual({
    bounds: query.bounds,
    states: [query.region],
  });
});

it('getLocation bounds and region and locationCoordinates', () => {
  const query = {
    needToAddBoundsInLocation: true,
    bounds: {
      northeast: { lat: 52.429222428484195, lng: -64.55566443750001 },
      southwest: { lat: 21.207458960637325, lng: -127.57324256250001 },
    },
    region: 'ID',
    locationCoordinates: {
      northeast: { lat: 12.429222428484195, lng: -64.55566443750001 },
      southwest: { lat: 11.207458960637325, lng: -127.57324256250001 },
    },
  };

  expect(getLocation(query)).toEqual({
    bounds: query.bounds,
    coordinates: query.locationCoordinates,
    states: [query.region],
  });
});
