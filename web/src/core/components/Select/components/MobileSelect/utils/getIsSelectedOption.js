export function getIsSelectedOption(selected, value) {
  if (typeof selected === 'object' && !Array.isArray(selected)) {
    return selected.value === value;
  }
  return selected?.find(({ value: v }) => v === value);
}
