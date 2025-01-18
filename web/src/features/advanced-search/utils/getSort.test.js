import { getSort } from './getSort';

it('sorting by nearest', () => {
  expect(getSort('both', true)).toEqual({ nearest: 'ASC' });
});

it('sorting by updated', () => {
  expect(getSort('remote', true)).toEqual({ updated: 'DESC' });
  expect(getSort('inPerson', false)).toEqual({ updated: 'DESC' });
});
