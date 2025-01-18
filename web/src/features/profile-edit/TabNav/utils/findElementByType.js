import { Children, isValidElement } from 'react';

export function findElementByType(type, children) {
  const elements = Children.toArray(children);
  for (const element of elements) {
    if (isValidElement(element)) {
      if (element.type === type) return element;
      const child = findElementByType(type, element.props.children);
      if (child) return child;
    }
  }
  return null;
}
