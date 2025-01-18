import { getSettings } from './getSettings';

it('getSettings setting=both', () => {
  expect(getSettings('both')).toEqual([
    {
      in_person: { available: true },
    },
    {
      remote: { available: true },
    },
  ]);
});

it('getSettings setting=remote', () => {
  expect(getSettings('remote')).toEqual([{ remote: { available: true } }]);
});

it('getSettings setting=inPerson', () => {
  const result = getSettings('inPerson');
  expect(result).toEqual([
    {
      in_person: { available: true },
    },
  ]);
});
