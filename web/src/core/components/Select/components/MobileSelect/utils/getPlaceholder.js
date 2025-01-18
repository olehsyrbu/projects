export function getPlaceholder(selectedLength = 0, totalLength, label = '') {
  if (selectedLength === totalLength) return `All ${label} selected`;
  return selectedLength > 0 ? `${label} (${selectedLength})` : label;
}
