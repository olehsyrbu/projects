import { omit, omitBy } from 'lodash-es';

export function prepForAnalytic(query, originalLocation) {
  let result = omitBy(
    omit(query, ['distance', 'page', 'limit']),
    (v) => Array.isArray(v) && v.length === 0,
  );

  if (result.location) {
    result.geo = result.location;
    result.location = originalLocation;
  }

  return result;
}
