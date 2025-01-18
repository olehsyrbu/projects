export function filterNonUndefinedValues(data) {
  return Object.keys(data).reduce((memo, key) => {
    if (data[key] !== undefined) {
      memo[key] = data[key];
    }
    return memo;
  }, {});
}
