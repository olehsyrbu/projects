import { Children } from 'react';

export function toItems(children) {
  return Children.map(children, (child) => {
    return {
      id: child.props.id,
      label: child.props.label,
      component: child.props.component,
      query: child.props.query,
      position: child.props.position,
    };
  });
}
