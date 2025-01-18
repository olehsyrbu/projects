import { typesByLocationAdapter } from './typesByLocationAdapter';

it('converts update payload', () => {
  const payload = [
    {
      id: 'some loc id',
      types: [
        {
          amount: 1,
          type: '111',
        },
        {
          amount: 2,
          type: '222',
        },
      ],
    },
  ];

  expect(typesByLocationAdapter.toUpdateInput(payload)).toEqual([
    {
      provider_location_id: 'some loc id',
      types: [
        {
          amount: 1,
          program_type: '111',
        },
        {
          amount: 2,
          program_type: '222',
        },
      ],
    },
  ]);
});
