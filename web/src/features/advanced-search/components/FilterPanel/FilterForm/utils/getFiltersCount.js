import { isEqual } from 'lodash-es';

export function getFiltersCount(item = {}) {
  const defaults = item.component.defaultProps;
  const current = item.query;

  return Object.keys(defaults.query).reduce((memo, key) => {
    const currentValue = current[key];
    if (!isEqual(defaults?.query[key], currentValue)) {
      memo = Array.isArray(currentValue) ? memo + currentValue.length : memo + 1;
    }
    return memo;
  }, 0);
}
