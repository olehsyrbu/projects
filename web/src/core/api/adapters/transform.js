import { isFunction } from 'lodash-es';

/**
 * Prepare transformation function, which by default go over
 * fields name and switch from `snake` to `camel case`, this behaviour
 * could be customized by passing object with mapping rules
 * @param mapping
 * @returns {function(*): {[p: string]: any}}
 */
export function createTransform(mapping = {}) {
  return (data) => {
    if (!data) {
      return data;
    }

    return transform(data, (key, val) => {
      let target = mapping[key];
      let nextKey = key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());

      if (target) {
        if (isFunction(target)) {
          return [nextKey, target(val)];
        }

        return [target, val];
      }

      return [nextKey, val];
    });
  };
}

function transform(data, t) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => {
      return t(k, v);
    }),
  );
}
