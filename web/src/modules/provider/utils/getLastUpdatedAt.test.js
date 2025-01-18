import { getLastUpdatedAt } from './getLastUpdatedAt';

it('should return date from updatedAt', () => {
  const updatedAt = '2022-04-12T14:37:00.924Z';
  const availability = {
    updated_at: '2022-03-10T14:37:00.924Z',
  };
  const lastUpdatedAt = getLastUpdatedAt(updatedAt, availability);
  expect(lastUpdatedAt).toBe(updatedAt);
});

it('should return date from availability', () => {
  const updatedAt = '2022-03-12T14:37:00.924Z';
  const availability = {
    updated_at: '2022-04-10T14:37:00.924Z',
  };
  const lastUpdatedAt = getLastUpdatedAt(updatedAt, availability);
  expect(lastUpdatedAt).toBe(availability.updated_at);
});
