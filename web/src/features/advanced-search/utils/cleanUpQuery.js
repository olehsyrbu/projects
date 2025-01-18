import { cloneDeep, pickBy } from 'lodash-es';

export function cleanUpQuery(query) {
  return cloneDeep(pickBy(query, (v) => v != null && v !== ''));
}
