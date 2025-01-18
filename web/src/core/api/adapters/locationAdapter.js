import { addressAdapter } from './addressAdapter';
import { createTransform } from './transform';

export const locationAdapter = {
  toUpdateInput: createTransform({
    accommodations: 'accommodation_ids',
    address: addressAdapter.toUpdateInput,
    facilityType: 'facility_type_id',
  }),
};
