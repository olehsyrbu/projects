import { createTransform } from './transform';

export const programDraftAdapter = {
  toCreateInput: createTransform({
    center: 'center_name',
  }),
};
