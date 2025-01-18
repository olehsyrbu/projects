import { QueryConvertor } from './QueryConvertor';

export const createSearchQueryConvertor =
  ({ page, limit, sort, ...filters }) =>
  (data = {}) => {
    const toMain = QueryConvertor.buildConvertor({ page, limit, sort });
    const toFilter = QueryConvertor.buildConvertor(filters);

    return {
      filter: toFilter(data),
      ...toMain(data),
    };
  };
