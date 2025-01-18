import { parseLocationDetail } from '@/core/api/MapsAPI';

it('check parseLocationDetail all fields should be', async () => {
  const address_components = [
    {
      long_name: '15',
      short_name: '15',
      types: ['street_number'],
    },
    {
      long_name: 'Elinor Place',
      short_name: 'Elinor Pl',
      types: ['route'],
    },
    {
      long_name: 'Park Hill',
      short_name: 'Park Hill',
      types: ['neighborhood', 'political'],
    },
    {
      long_name: 'Yonkers',
      short_name: 'Yonkers',
      types: ['locality', 'political'],
    },
    {
      long_name: 'Westchester County',
      short_name: 'Westchester County',
      types: ['administrative_area_level_2', 'political'],
    },
    {
      long_name: 'New York',
      short_name: 'NY',
      types: ['administrative_area_level_1', 'political'],
    },
    {
      long_name: 'Соединенные Штаты Америки',
      short_name: 'US',
      types: ['country', 'political'],
    },
    {
      long_name: '10705',
      short_name: '10705',
      types: ['postal_code'],
    },
    {
      long_name: '3844',
      short_name: '3844',
      types: ['postal_code_suffix'],
    },
  ];

  const { address, zipCode, state, city } = parseLocationDetail(address_components);

  expect(address).toBe('15 Elinor Place');
  expect(zipCode).toBe('10705');
  expect(state).toEqual({ name: 'New York', code: 'NY' });
  expect(city).toBe('Yonkers');
});

it('check parseLocationDetail empty object', async () => {
  const location = parseLocationDetail();
  expect(location).toBeUndefined();
});

it('check parseLocationDetail address', async () => {
  const address_components = [
    {
      long_name: '11',
      short_name: '11',
      types: ['street_number'],
    },
    {
      long_name: 'Elinor Place',
      short_name: 'Elinor Pl',
      types: ['route'],
    },
  ];
  const location = parseLocationDetail(address_components);
  expect(location.address).toBe('11 Elinor Place');
  expect(location.zipCode).toBe('');
});
