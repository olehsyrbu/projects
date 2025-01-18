import { provideDefaultCoordinates } from './provideDefaultCoordinates';

it('provideDefaultCoordinates', () => {
  const defaultCoordinates = provideDefaultCoordinates();
  expect(defaultCoordinates).toEqual({
    lat: 37.09024,
    lng: -95.712891,
  });
});
