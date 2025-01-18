import { addressAdapter } from './addressAdapter';

it('transforms payload to input update', () => {
  expect(
    addressAdapter.toUpdateInput({
      address1: 'Test Str',
      address2: 'Test Other Str',
      city: 'Test City',
      state: 'some-state-id',
      zip: 'zip',
    }),
  ).toEqual({
    address1: 'Test Str',
    address2: 'Test Other Str',
    city: 'Test City',
    state_id: 'some-state-id',
    zip: 'zip',
  });
});
