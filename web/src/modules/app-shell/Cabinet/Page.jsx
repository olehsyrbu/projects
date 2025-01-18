import { createElement } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export function Page({ className, as = 'main', children, style }) {
  return createElement(
    as,
    {
      className: cn('mir-cabinet-page', className),
      style,
    },
    children,
  );
}

Page.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
};
