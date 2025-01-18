import { typesOnRemoteAdapter } from './typesOnRemoteAdapter';

it('converts update payload', () => {
  const payload = [
    {
      amount: 1,
      type: '111',
    },
    {
      amount: 2,
      type: '222',
    },
  ];

  expect(typesOnRemoteAdapter.toUpdateInput(payload)).toEqual([
    {
      amount: 1,
      program_type: '111',
    },
    {
      amount: 2,
      program_type: '222',
    },
  ]);
});
