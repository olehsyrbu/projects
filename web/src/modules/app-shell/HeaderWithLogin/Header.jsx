import { useState } from 'react';
import { Navigation24Filled as Navigation } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import MobileDialog from '@/deprecated/components/MobileDialog/MobileDialog';
import MobileBurgerMenu from './components/MobileBurgerMenu';
import { useAuthContext } from '@/modules/auth';
import UserInfoWithDropDown from './components/UserInfoWithDropDown/UserInfoWithDropDown';
import Logo from '../Logo';
import Login from '@/modules/account/components/Login';
import './Header.css';
import PropTypes from 'prop-types';

export default function Header({ children, login }) {
  return useScreen('md') ? <HeaderDesktop children={children} login={login} /> : <HeaderMobile />;
}

function HeaderDesktop({ children, login }) {
  const { user } = useAuthContext();
  return (
    <header className="HeaderDesktop">
      <Logo />
      {children}
      {login && <div className="ml-auto">{user ? <UserInfoWithDropDown /> : <Login />}</div>}
    </header>
  );
}

function HeaderMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="HeaderMobile">
      <button aria-label="Navigations" className="" onClick={() => setOpen(true)}>
        <Navigation className="text-p-100" />
      </button>
      <Logo />
      <MobileDialog isOpen={open} aria-label="Mobile menu" contentClassName="rounded-b-3xl">
        <MobileBurgerMenu onDismiss={() => setOpen(false)} />
      </MobileDialog>
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  login: PropTypes.bool,
};

HeaderDesktop.propTypes = {
  children: PropTypes.node,
  login: PropTypes.bool,
};

HeaderDesktop.defaultProps = {
  login: true,
};
