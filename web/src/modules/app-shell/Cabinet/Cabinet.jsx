import PropTypes from 'prop-types';
import { useMatchMedia } from '@/core/hooks';

import Sidebar from '../Sidebar';
import { MobileNavbar } from '../MobileNavbar';
import './Cabinet.css';
import cn from 'classnames';
export function Cabinet({ children, navigation, className, containerClassName }) {
  let wideScreen = useMatchMedia('(min-width: 768px)');
  let Navbar = wideScreen ? Sidebar : MobileNavbar;

  return (
    <div className={`mir-cabinet ${className}`}>
      <Navbar>{navigation.props.children}</Navbar>
      <div className={cn('mir-cabinet-page-container', containerClassName)}>{children}</div>
    </div>
  );
}

Cabinet.propTypes = {
  navigation: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

Cabinet.defaultProps = {
  navigation: null,
};
