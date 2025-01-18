import { map } from './map';
import { createTransform } from './transform';

export const typesOnRemoteAdapter = {
  toUpdateInput: map(
    createTransform({
      type: 'program_type',
    }),
  ),
};
