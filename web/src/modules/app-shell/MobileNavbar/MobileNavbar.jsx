import { Children, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth';
import { EditAccountDialog } from '@/modules/account/components';
import PropTypes from 'prop-types';
import MobileDialog from '@/deprecated/components/MobileDialog/MobileDialog';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import { Navigation24Filled as Navigation } from '@fluentui/react-icons';
import Logo from '@/modules/app-shell/Logo';

export function MobileNavbar({ children }) {
  const [navMenu, setNavMenu] = useState(false);
  const toggleNavMenu = () => setNavMenu(!navMenu);

  function handleClickLink(e) {
    e.stopPropagation();
    setNavMenu(false);
  }

  return (
    <>
      <Header navMenu={navMenu} toggleNavMenu={toggleNavMenu} />
      <MobileDialog isOpen={navMenu} aria-label="Mobile menu" contentClassName="rounded-b-3xl">
        <Header navMenu={navMenu} toggleNavMenu={toggleNavMenu} />
        <div className="grid grid-rows-[1fr_auto] py-4">
          <div className="flex flex-col border-b border-solid border-graphics-30 pb-6 text-center text-xl font-medium">
            <ul className="space-y-8">
              {Children.map(children, (child) => (
                <li onClick={handleClickLink}>{child}</li>
              ))}
            </ul>
          </div>

          <Suspense fallback={null}>
            <ProfileInfo />
          </Suspense>
        </div>
      </MobileDialog>
    </>
  );
}

MobileNavbar.propTypes = {
  children: PropTypes.node,
};

function Header({ toggleNavMenu, navMenu }) {
  return (
    <div className="sticky top-0 z-30 grid h-full grid-rows-[auto_1fr] bg-white md:hidden">
      <div className="flex h-16 items-center justify-start px-5">
        <button onClick={toggleNavMenu}>
          {!navMenu && <Navigation className="text-p-100" />}
          {navMenu && <Dismiss className="text-p-100" />}
        </button>
        <Logo />
      </div>
    </div>
  );
}

Header.propTypes = {
  toggleNavMenu: PropTypes.func,
  navMenu: PropTypes.bool,
};

function ProfileInfo() {
  let navigate = useNavigate();
  let { user, logOut } = useAuthContext();

  let [accountEditOpen, setAccountEditOpen] = useState(false);

  function handleLogOut() {
    logOut();
    navigate('/', { replace: true });
  }

  return (
    <>
      <div className="mb-4 mt-6 text-center">
        <p className="mb-1 font-bold">{user.fullName}</p>
        <p className="mb-2 text-sm text-hint">{user.email}</p>
        <div className="flex justify-center space-x-10 font-medium text-p-100">
          <button onClick={() => setAccountEditOpen(true)}>Edit Account</button>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      </div>
      {accountEditOpen ? (
        <EditAccountDialog isOpen={accountEditOpen} onDismiss={() => setAccountEditOpen(false)} />
      ) : null}
    </>
  );
}
