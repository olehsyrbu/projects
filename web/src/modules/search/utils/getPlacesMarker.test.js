import { getPlacesMarker } from './getPlacesMarker';

it('providers without location, should return empty array', () => {
  const providers = [
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      locations: [{ address: null }],
    },
    {
      id: 'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'vlad.png',
      locations: [{ address: null }],
      slug: 'auto-provider-HSjL',
    },
  ];
  expect(getPlacesMarker(providers)).toEqual([]);
});

it('2 providers have by 1 location, should get 2 markers', () => {
  const providers = [
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'igor.png',
      slug: 'igor-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-222.0424393, 20.6047446],
            },
          },
        },
      ],
    },
    {
      id: 'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'vlad.png',
      slug: 'vlad-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-100.0424393, 10.6047446],
            },
          },
        },
      ],
    },
  ];
  expect(getPlacesMarker(providers)).toEqual([
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 20.6047446,
      lng: -222.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
    {
      id: 'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 10.6047446,
      lng: -100.0424393,
      photoUrl: 'vlad.png',
      slug: 'vlad-provider',
    },
  ]);
});

it('2 providers have by 2 same locations, should get 2 cluster markers', () => {
  const providers = [
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'igor.png',
      slug: 'igor-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-11.0424393, 11.6047446],
            },
          },
        },
      ],
    },
    {
      id: 'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'vlad.png',
      slug: 'vlad-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-11.0424393, 11.6047446],
            },
          },
        },
      ],
    },
  ];
  expect(getPlacesMarker(providers)).toEqual([
    {
      cluster: [
        'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
        'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      ],
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 10.6047446,
      lng: -10.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
    {
      cluster: [
        'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
        'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      ],
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 11.6047446,
      lng: -11.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
  ]);
});

it('2 providers have by 2 locations with same coordinates, should get 1 cluster marker with 2 providers', () => {
  const providers = [
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'igor.png',
      slug: 'igor-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
      ],
    },
    {
      id: 'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'vlad.png',
      slug: 'vlad-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
      ],
    },
  ];
  expect(getPlacesMarker(providers)).toEqual([
    {
      cluster: [
        'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
        'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      ],
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 10.6047446,
      lng: -10.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
  ]);
});

it('2 providers have by 3 locations with 2 same coordinates and 1 not, should get 2 cluster markers', () => {
  const providers = [
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'igor.png',
      slug: 'igor-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-33.0424393, 33.6047446],
            },
          },
        },
      ],
    },
    {
      id: 'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'vlad.png',
      slug: 'vlad-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-33.0424393, 33.6047446],
            },
          },
        },
      ],
    },
  ];

  expect(getPlacesMarker(providers)).toEqual([
    {
      cluster: [
        'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
        'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      ],
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 10.6047446,
      lng: -10.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
    {
      cluster: [
        'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
        'vlad-17302107-81a4-48e4-92c8-15d85eb6e948',
      ],
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 33.6047446,
      lng: -33.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
  ]);
});

it('one provider has 2 equal location', () => {
  const providers = [
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      photoUrl: 'igor.png',
      slug: 'igor-provider',
      locations: [
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
        {
          address: {
            coordinates: {
              coordinates: [-10.0424393, 10.6047446],
            },
          },
        },
      ],
    },
  ];

  expect(getPlacesMarker(providers)).toEqual([
    {
      id: 'igor-17302107-81a4-48e4-92c8-15d85eb6e948',
      lat: 10.6047446,
      lng: -10.0424393,
      photoUrl: 'igor.png',
      slug: 'igor-provider',
    },
  ]);
});
