export function getIsFocusedOption({ index, indexGroup = -1, currItem, currGroupItem }) {
  return currItem === index && currGroupItem === indexGroup;
}
