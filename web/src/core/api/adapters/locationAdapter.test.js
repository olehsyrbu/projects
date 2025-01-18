import { addressAdapter } from './addressAdapter';
import { locationAdapter } from './locationAdapter';

it('transforms payload to input update', () => {
  let payload = {
    id: 'xxxxxx',
    phone: '999999999',
    name: 'Foo',
    accommodations: ['ac1', 'ac2'],
    address: {
      address1: 'Test Str',
      address2: 'Test Other Str',
      city: 'Test City',
      state: 'some-state-id',
      zip: 'zip',
    },
  };
  expect(locationAdapter.toUpdateInput(payload)).toEqual({
    accommodation_ids: ['ac1', 'ac2'],
    address: addressAdapter.toUpdateInput(payload.address),
    facility_type_id: payload.facilityType,
    hide: payload.hide,
    id: payload.id,
    name: payload.name,
    phone: payload.phone,
  });
});
