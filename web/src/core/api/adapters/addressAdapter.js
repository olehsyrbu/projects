import { createTransform } from './transform';

export const addressAdapter = {
  toUpdateInput: createTransform({
    state: 'state_id',
  }),
};
