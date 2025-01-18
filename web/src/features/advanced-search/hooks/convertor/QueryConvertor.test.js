import { QueryConvertor } from './QueryConvertor';

it('converts number with default', () => {
  const toQuery = QueryConvertor.buildConvertor({
    page: {
      type: Number,
      default: 1,
    },
  });

  expect(toQuery()).toEqual({
    page: 1,
  });

  expect(toQuery({ page: 5 })).toEqual({
    page: 5,
  });
});

it('converts array with defaults', () => {
  const toQuery = QueryConvertor.buildConvertor({
    modalities: {
      type: Array,
    },
  });

  expect(toQuery()).toEqual({});

  expect(
    toQuery({
      modalities: ['000', '111', '222'],
    }),
  ).toEqual({
    modalities: ['000', '111', '222'],
  });
});

it('converts array with custom convertor', () => {
  const toQuery = QueryConvertor.buildConvertor({
    ageGroups: {
      type: Array,
      toQuery: (val) => ({ age_groups_id: [...val] }),
    },
  });

  expect(
    toQuery({
      ageGroups: ['10', '20'],
    }),
  ).toEqual({
    age_groups_id: ['10', '20'],
  });
});
