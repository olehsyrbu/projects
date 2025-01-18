import { hasDefaultCoordinates } from './hasDefaultCoordinates';
import { provideDefaultCoordinates } from '../utils';

it('hasDefaultCoordinates should return true', () => {
  const result = hasDefaultCoordinates(provideDefaultCoordinates());
  expect(result).toBe(true);
});

it('hasDefaultCoordinates should return false', () => {
  const result = hasDefaultCoordinates({});
  expect(result).toBe(false);
});
