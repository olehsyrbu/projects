import { map } from './map';
import { createTransform } from './transform';

export const typesByLocationAdapter = {
  toUpdateInput: map(
    createTransform({
      id: 'provider_location_id',
      types: map(
        createTransform({
          type: 'program_type',
        }),
      ),
    }),
  ),
};
